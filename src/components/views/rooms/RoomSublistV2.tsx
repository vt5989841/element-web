import React, { useEffect, useState } from "react";
import { Room } from "matrix-js-sdk/src/models/room";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import RoomListStore from "../../../stores/room-list/RoomListStore";
import { DefaultTagID } from "../../../stores/room-list/models";
import RoomTile from "./RoomTile";
import { LISTS_UPDATE_EVENT } from "../../../stores/room-list/RoomListStore";

interface IProps {
    isMinimized: boolean;
}

// Các tag chúng ta muốn merge
const INCLUDED_TAGS = [
    DefaultTagID.DM,
    DefaultTagID.Untagged, // Regular rooms
];

export const RoomSublistV2: React.FC<IProps> = ({ isMinimized }) => {
    const [rooms, setRooms] = useState<Array<{ tagId: string, room: Room }>>([]);

    // Lấy và merge rooms từ nhiều tags
    const updateRooms = () => {
        const allRooms: Array<{ tagId: string, room: Room }> = [];
        const lists = RoomListStore.instance.orderedLists;

        INCLUDED_TAGS.forEach(tagId => {
            if (lists[tagId]) {
                lists[tagId].map(room => ({ tagId, room })).forEach(item => {
                    allRooms.push(item);
                });
            }
        });

        // Sắp xếp theo thời gian hoạt động gần đây nhất
        const sortedRooms = allRooms.sort((a, b) => {
            return b.room.getLastActiveTimestamp() - a.room.getLastActiveTimestamp();
        });

        // Loại bỏ các phòng trùng lặp (nếu một phòng thuộc nhiều tag)
        const uniqueRooms = Array.from(new Map(
            sortedRooms.map(item => [item.room.roomId, item])
        ).values());

        setRooms(uniqueRooms);
    };

    useEffect(() => {
        // Lắng nghe sự thay đổi của room list
        const onListsUpdate = () => {
            updateRooms();
        };

        RoomListStore.instance.on(LISTS_UPDATE_EVENT, onListsUpdate);
        updateRooms(); // Khởi tạo lần đầu

        return () => {
            RoomListStore.instance.off(LISTS_UPDATE_EVENT, onListsUpdate);
        };
    }, []);

    // Render danh sách phòng
    const renderRooms = () => {
        return rooms.map((item) => {
            return (
                <RoomTile
                    key={item.room.roomId}
                    room={item.room}
                    showMessagePreview={true}
                    isMinimized={isMinimized}
                    tag={item.tagId}
                />
            );
        });
    };

    return (
        <Box
            flex={1}
            overflow="auto"
            px={2}
            pt={3}
        >
            <Flex pl={1} mb={2}>
                <Text fontSize={15} fontWeight={600} color="#374957">Chats</Text>
            </Flex>
            <VStack spaceY={1} align="stretch">
                {renderRooms()}
            </VStack>
        </Box>
    );
};

// Tùy chọn: Tạo hook riêng để tái sử dụng logic lấy rooms
export const useAllRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const updateRooms = () => {
            const allRooms: Room[] = [];
            const lists = RoomListStore.instance.orderedLists;

            INCLUDED_TAGS.forEach(tagId => {
                if (lists[tagId]) {
                    allRooms.push(...lists[tagId]);
                }
            });

            const sortedRooms = allRooms.sort((a, b) => {
                return b.getLastActiveTimestamp() - a.getLastActiveTimestamp();
            });

            const uniqueRooms = Array.from(new Map(
                sortedRooms.map(room => [room.roomId, room])
            ).values());

            setRooms(uniqueRooms);
        };

        RoomListStore.instance.on(LISTS_UPDATE_EVENT, updateRooms);
        updateRooms();

        return () => {
            RoomListStore.instance.off(LISTS_UPDATE_EVENT, updateRooms);
        };
    }, []);

    return rooms;
}; 