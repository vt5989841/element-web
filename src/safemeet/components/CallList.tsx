import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import LegacyCallHandler, { LegacyCallHandlerEvent } from "../../LegacyCallHandler";
import { MatrixClientPeg } from "../../MatrixClientPeg";
import { Room } from "matrix-js-sdk/src/models/room";
import RoomTile from "@components/views/rooms/RoomTile";
import { DefaultTagID } from "@src/stores/room-list/models";
import { useAllRooms } from "./RoomSublistV2";

interface IProps {
    isMinimized: boolean;
}

export const CallList: React.FC<IProps> = ({ isMinimized }) => {
    const [recentCalls, setRecentCalls] = useState<{room: Room, timestamp: number}[]>([]);
    const rooms = useAllRooms();

    const updateRecentCalls = useCallback(() => {
        const callRooms = rooms.filter(room => {
            // Kiểm tra xem phòng có cuộc gọi đang diễn ra hoặc gần đây
            const lastCallEvent = room.getLiveTimeline().getEvents().find(event => 
                event.getType() === "m.call.hangup" || 
                event.getType() === "m.call.invite"
            );
            return lastCallEvent !== undefined;
        });

        // Sắp xếp theo thời gian gần đây nhất
        const sortedCallRooms = callRooms.map(room => {
            const lastCallEvent = room.getLiveTimeline().getEvents().find(event =>
                event.getType() === "m.call.hangup" ||
                event.getType() === "m.call.invite"
            );
            return {
                room,
                timestamp: lastCallEvent?.getTs() || 0
            };
        }).sort((a, b) => b.timestamp - a.timestamp);

        setRecentCalls(sortedCallRooms);
    }, [rooms]);

    useEffect(() => {
        updateRecentCalls(); // Khởi tạo lần đầu
    }, [updateRecentCalls]);

    const renderCalls = () => {
        return recentCalls.map((item) => (
            <RoomTile
                key={item.room.roomId}
                room={item.room}
                showMessagePreview
                isMinimized={isMinimized}
                tag={DefaultTagID.Untagged}
            />
        ));
    };

    return (
        <Box
            flex={1}
            overflow="auto"
            px={2}
            pt={3}
        >
            <Flex pl={1} mb={2}>
                <Text fontSize={15} fontWeight={600} color="#374957">Recent Calls</Text>
            </Flex>
            <Flex direction="column" gap={0} align="stretch" w="100%">
                {renderCalls()}
            </Flex>
        </Box>
    );
}; 