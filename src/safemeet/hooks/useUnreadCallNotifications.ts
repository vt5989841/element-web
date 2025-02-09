import { useCallback, useEffect, useState } from "react";
import { Room, RoomEvent } from "matrix-js-sdk/src/matrix";
import { determineUnreadState } from "@src/RoomNotifs";
import { NotificationLevel } from "@src/stores/notifications/NotificationLevel";
import RoomListStore from "@src/stores/room-list/RoomListStore";
import { CHAT_LIST_TAGS } from "@safemeet/utils";
import { LISTS_UPDATE_EVENT } from "@src/stores/room-list/RoomListStore";
import { MatrixClientPeg } from "@src/MatrixClientPeg";

export const useUnreadCallNotifications = () => {
    const [hasUnread, setHasUnread] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);

    const checkUnreadFromCallRooms = useCallback((rooms: Room[]) => {
        const hasUnreadCalls = rooms.some((room) => {
            const { count, level } = determineUnreadState(room);
            
            const hasUnreadCallMessages = room.getLiveTimeline().getEvents().some(event => {
                const eventId = event.getId();
                return eventId && !room.hasUserReadEvent(MatrixClientPeg.safeGet().getSafeUserId(), eventId) && 
                       (event.getType() === "m.call.invite" || 
                        event.getType() === "m.call.hangup" ||
                        event.getType() === "m.call.reject");
            });

            return count > 0 && level > NotificationLevel.None && hasUnreadCallMessages;
        });
        
        setHasUnread(hasUnreadCalls);
    }, []);

    useEffect(() => {
        const updateRooms = () => {
            const allRooms: Room[] = [];
            const lists = RoomListStore.instance.orderedLists;

            CHAT_LIST_TAGS.forEach(tagId => {
                if (lists[tagId]) {
                    allRooms.push(...lists[tagId]);
                }
            });

            const uniqueRooms = Array.from(new Map(
                allRooms.map(room => [room.roomId, room])
            ).values());

            setRooms(uniqueRooms);
        };

        RoomListStore.instance.on(LISTS_UPDATE_EVENT, updateRooms);
        updateRooms();

        return () => {
            RoomListStore.instance.off(LISTS_UPDATE_EVENT, updateRooms);
        };
    }, []);

    useEffect(() => {
        checkUnreadFromCallRooms(rooms);

        const onEvent = () => checkUnreadFromCallRooms(rooms);

        rooms.forEach((room) => {
            room.on(RoomEvent.UnreadNotifications, onEvent);
            room.on(RoomEvent.Receipt, onEvent);
            room.on(RoomEvent.Timeline, onEvent);
            room.on(RoomEvent.Redaction, onEvent);
            room.on(RoomEvent.LocalEchoUpdated, onEvent);
            room.on(RoomEvent.MyMembership, onEvent);
        });

        return () => {
            rooms.forEach((room) => {
                room.off(RoomEvent.UnreadNotifications, onEvent);
                room.off(RoomEvent.Receipt, onEvent);
                room.off(RoomEvent.Timeline, onEvent);
                room.off(RoomEvent.Redaction, onEvent);
                room.off(RoomEvent.LocalEchoUpdated, onEvent);
                room.off(RoomEvent.MyMembership, onEvent);
            });
        };
    }, [rooms]);

    return hasUnread;
}; 