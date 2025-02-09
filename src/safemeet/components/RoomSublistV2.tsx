import React, { useEffect, useState } from "react";
import { Room } from "matrix-js-sdk/src/models/room";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import RoomListStore from "../../stores/room-list/RoomListStore";
import { DefaultTagID } from "../../stores/room-list/models";
import RoomTile from "../../components/views/rooms/RoomTile";
import { LISTS_UPDATE_EVENT } from "../../stores/room-list/RoomListStore";

interface IProps {
    isMinimized: boolean;
}

// Tags we want to merge
const INCLUDED_TAGS = [
    DefaultTagID.DM,
    DefaultTagID.Untagged, // Regular rooms
];

export const RoomSublistV2: React.FC<IProps> = ({ isMinimized }) => {
    const [rooms, setRooms] = useState<Array<{ tagId: string, room: Room }>>([]);

    // Get and merge rooms from multiple tags
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

        // Sort by most recent activity
        const sortedRooms = allRooms.sort((a, b) => {
            return b.room.getLastActiveTimestamp() - a.room.getLastActiveTimestamp();
        });

        // Remove duplicate rooms (if a room belongs to multiple tags)
        const uniqueRooms = Array.from(new Map(
            sortedRooms.map(item => [item.room.roomId, item])
        ).values());

        setRooms(uniqueRooms);
    };

    useEffect(() => {
        // Listen for room list changes
        const onListsUpdate = () => {
            updateRooms();
        };

        RoomListStore.instance.on(LISTS_UPDATE_EVENT, onListsUpdate);
        updateRooms(); // Initial load

        return () => {
            RoomListStore.instance.off(LISTS_UPDATE_EVENT, onListsUpdate);
        };
    }, []);

    // Render room list
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
            <Flex direction="column" gap={0} align="stretch" w="100%">
                {renderRooms()}
            </Flex>
        </Box>
    );
};

// Optional: Create a separate hook for reusing room fetching logic
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