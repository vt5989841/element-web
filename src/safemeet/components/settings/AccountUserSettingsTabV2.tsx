import React, { useCallback, useContext, useEffect, useState } from "react";
import { HTTPError } from "matrix-js-sdk/src/matrix";
import { logger } from "matrix-js-sdk/src/logger";
import {
    Box,
    VStack,
    Heading,
    Text,
    Button,
    useDisclosure,
} from "@chakra-ui/react";
import { _t } from "../../../languageHandler";
import SettingsStore from "../../../settings/SettingsStore";
import Modal from "../../../Modal";
import { UIFeature } from "../../../settings/UIFeature";
import { SDKContext } from "../../../contexts/SDKContext";
import { useMatrixClientContext } from "../../../contexts/MatrixClientContext";
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
} from "../ui/dialog";
import { extractErrorMessageFromError } from "@src/vector/init";
import UserProfileSettings from "@components/views/settings/UserProfileSettings";
import ChangePassword from "@components/views/settings/ChangePassword";
import DeactivateAccountDialog from "@components/views/dialogs/DeactivateAccountDialog";
import { UserPersonalInfoSettings } from "@components/views/settings/UserPersonalInfoSettings";

interface IProps {
    closeSettingsFn: () => void;
}

const AccountSection = ({
    canChangePassword,
    onPasswordChangeError,
    onPasswordChanged,
}: {
    canChangePassword: boolean;
    onPasswordChangeError: (e: Error) => void;
    onPasswordChanged: () => void;
}) => {
    if (!canChangePassword) return null;

    return (
        <Box>
            <Heading size="md" mb={4}>{_t("settings|general|account_section")}</Heading>
            <Text mb={4} color="gray.600">
                {_t("settings|general|password_change_section")}
            </Text>
            <ChangePassword
                buttonKind="primary"
                onError={onPasswordChangeError}
                onFinished={onPasswordChanged}
            />
        </Box>
    );
};

const ManagementSection = ({ onDeactivateClicked }: { onDeactivateClicked: () => void }) => {
    return (
        <Box>
            <Heading size="md" mb={4}>{_t("settings|general|account_management_section")}</Heading>
            <Text mb={4} color="gray.600">
                {_t("settings|general|deactivate_warning")}
            </Text>
            <Button
                colorScheme="red"
                onClick={onDeactivateClicked}
            >
                {_t("settings|general|deactivate_section")}
            </Button>
        </Box>
    );
};

export const AccountUserSettingsTabV2: React.FC<IProps> = ({ closeSettingsFn }) => {
    const [externalAccountManagementUrl, setExternalAccountManagementUrl] = useState<string>();
    const [canMake3pidChanges, setCanMake3pidChanges] = useState(false);
    const [canSetDisplayName, setCanSetDisplayName] = useState(false);
    const [canSetAvatar, setCanSetAvatar] = useState(false);
    const [canChangePassword, setCanChangePassword] = useState(false);
    const { open: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure();
    const [errorDialog, setErrorDialog] = useState<{title: string, description: string}>();

    const cli = useMatrixClientContext();
    const sdkContext = useContext(SDKContext);

    useEffect(() => {
        (async () => {
            const capabilities = (await cli.getCapabilities()) ?? {};
            const changePasswordCap = capabilities["m.change_password"];
            const canChangePassword = !changePasswordCap || changePasswordCap["enabled"] !== false;

            await sdkContext.oidcClientStore.readyPromise;
            const externalAccountManagementUrl = sdkContext.oidcClientStore.accountManagementEndpoint;
            const canMake3pidChanges = !capabilities["m.3pid_changes"] || capabilities["m.3pid_changes"].enabled === true;
            const canSetDisplayName = !capabilities["m.set_displayname"] || capabilities["m.set_displayname"].enabled === true;
            const canSetAvatar = !capabilities["m.set_avatar_url"] || capabilities["m.set_avatar_url"].enabled === true;

            setCanMake3pidChanges(canMake3pidChanges);
            setCanSetDisplayName(canSetDisplayName);
            setCanSetAvatar(canSetAvatar);
            setExternalAccountManagementUrl(externalAccountManagementUrl);
            setCanChangePassword(canChangePassword);
        })();
    }, [cli, sdkContext.oidcClientStore]);

    const onPasswordChangeError = useCallback((err: Error): void => {
        logger.error("Failed to change password: " + err);

        let underlyingError = err;
        if (err.cause instanceof Error) {
            underlyingError = err.cause;
        }

        const errorMessage = extractErrorMessageFromError(
            err,
            _t("settings|general|error_password_change_unknown", {
                stringifiedError: String(err),
            }),
        );

        let errorMessageToDisplay = errorMessage;
        if (underlyingError instanceof HTTPError && underlyingError.httpStatus === 403) {
            errorMessageToDisplay = _t("settings|general|error_password_change_403");
        } else if (underlyingError instanceof HTTPError) {
            errorMessageToDisplay = _t("settings|general|error_password_change_http", {
                errorMessage,
                httpStatus: underlyingError.httpStatus,
            });
        }

        setErrorDialog({
            title: _t("settings|general|error_password_change_title"),
            description: errorMessageToDisplay,
        });
        onErrorOpen();
    }, [onErrorOpen]);

    const onPasswordChanged = useCallback((): void => {
        setErrorDialog({
            title: _t("common|success"),
            description: _t("settings|general|password_change_success"),
        });
        onErrorOpen();
    }, [onErrorOpen]);

    const onDeactivateClicked = useCallback((): void => {
        Modal.createDialog(DeactivateAccountDialog, {
            onFinished: (success?: boolean) => {
                if (success) closeSettingsFn();
            },
        });
    }, [closeSettingsFn]);

    const isAccountManagedExternally = Boolean(externalAccountManagementUrl);

    return (
        <Box p={6}>
            <VStack 
                gap={8} 
                align="stretch"
                divideY="1px"
                divideColor="gray.200"
            >
                <UserProfileSettings
                    externalAccountManagementUrl={externalAccountManagementUrl}
                    canSetDisplayName={canSetDisplayName}
                    canSetAvatar={canSetAvatar}
                />

                {(!isAccountManagedExternally || canMake3pidChanges) && (
                    <UserPersonalInfoSettings canMake3pidChanges={canMake3pidChanges} />
                )}

                <AccountSection
                    canChangePassword={canChangePassword}
                    onPasswordChanged={onPasswordChanged}
                    onPasswordChangeError={onPasswordChangeError}
                />

                {SettingsStore.getValue(UIFeature.Deactivate) && !isAccountManagedExternally && (
                    <ManagementSection onDeactivateClicked={onDeactivateClicked} />
                )}
            </VStack>

            <DialogRoot open={isErrorOpen} onOpenChange={(e: { open: boolean }) => !e.open && onErrorClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{errorDialog?.title}</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Text>{errorDialog?.description}</Text>
                    </DialogBody>
                </DialogContent>
            </DialogRoot>
        </Box>
    );
};

export default AccountUserSettingsTabV2; 