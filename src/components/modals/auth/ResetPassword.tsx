import { router } from 'expo-router';
import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlErrorIcon,
    FormControlLabel,
    FormControlLabelText,
    Input,
    InputField,
    Button,
    ButtonText,
    Text,
    View,
    Box,
    InputIcon,
} from '@/components/ui';
import React, { useEffect, useRef, useState } from 'react';
import { AlertCircleIcon, Mail } from 'lucide-react-native';
import { removeAuthToken } from '@/lib/secureStore';
import { useStore, useTempStore } from '@/store';
import { showSnackbar } from '@/lib/utils';
import { SpinningLoader } from '@/components/loaders/SpinningLoader';
import { hapticFeed } from '@/components/HapticTab';
import { useAuthMutations } from '@/tanstack/mutations/useAuthMutations';
import BottomSheet from '@/components/shared/BottomSheet';

export default function ResetPasswordBottomSheet({ visible, onDismiss }: AuthModalProps) {
    const [isInvalid, setIsInvalid] = React.useState({
        email: false,
    });
    const { mutateAsync, isPending } =
        useAuthMutations().sendPasswordResetMutation;
    const { mutateAsync: resendCode, isPending: isSending } =
        useAuthMutations().sendPasswordResetMutation;
    const [form, setForm] = React.useState({
        email: '',
    });
    const [codeSheetVisible, setCodeSheetVisible] = useState(false);
    const [code, setCode] = useState('');
    const [timer, setTimer] = useState(300);
    const intervalRef = useRef<number | null>(null);

    const handleSubmit = async () => {
        hapticFeed();
        if (form.email.length < 5) {
            setIsInvalid({ ...isInvalid, email: true });
            return;
        } else {
            setIsInvalid({ email: false });
        }
        try {
            await mutateAsync(
                { email: form.email },
                {
                    onSuccess: () => {
                        showSnackbar({
                            message: 'Password reset code sent to your email.',
                            type: 'success',
                        });
                        setCodeSheetVisible(true);
                        setTimer(300);
                    },
                    onError: () => {
                        showSnackbar({
                            message: 'Please try again!',
                            type: 'warning',
                        });
                    },
                }
            );
        } catch (error) {
            console.log(error);
            showSnackbar({
                message: 'Error occurred! Please try again.',
                type: 'warning',
            });
        }
    };

    const handleResend = async () => {
        try {
            await resendCode(
                { email: form.email },
                {
                    onSuccess: () => {
                        showSnackbar({
                            message: 'Password reset code sent to your email.',
                            type: 'success',
                        });
                        setTimer(300);
                    },
                    onError: () => {
                        showSnackbar({
                            message: 'Please try again!',
                            type: 'warning',
                        });
                    },
                }
            );
        } catch (error) {
            console.log(error);
            showSnackbar({ message: 'Failed to resend code.', type: 'warning' });
        }
    };

    useEffect(() => {
        if (!codeSheetVisible) return;
        intervalRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1 && intervalRef.current) {
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [codeSheetVisible]);

    function onBack() {
        if (router.canGoBack()) {
            router.back();
        } else {
            removeAuthToken();
            useStore.getState().resetStore();
            useTempStore.getState().resetStore();
            router.replace('/signin');
        }
    }

    return (
        <>
            <BottomSheet visible={visible} onDismiss={onDismiss} snapPoint={['55%', '64%']} plain>
                <Box className="w-[98%] bg-background-muted/90 max-w-[26rem] gap-6 mt-4 mx-auto rounded-xl p-6 pb-16">
                    <View className=" gap-2">
                        <Text className=" text-2xl text-primary font-semibold font-heading text-center">
                            Forgot password
                        </Text>
                        <Text className=" text-center">
                            Please enter your email to reset the password
                        </Text>
                    </View>
                    <View>
                        <FormControl
                            isInvalid={isInvalid.email}
                            size="lg"
                            isRequired={false}>
                            <FormControlLabel>
                                <FormControlLabelText className="font-light">
                                    Email
                                </FormControlLabelText>
                            </FormControlLabel>
                            <Input className="my-1 rounded-xl px-4 h-14" size={'xl'}>
                                <InputIcon as={Mail} />
                                <InputField
                                    type="text"
                                    placeholder="Email"
                                    value={form.email}
                                    onChangeText={(text) => setForm({ ...form, email: text })}
                                />
                            </Input>
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon} />
                                <FormControlErrorText>
                                    enter a valid email address.
                                </FormControlErrorText>
                            </FormControlError>
                        </FormControl>
                    </View>
                    <Button
                        variant="solid"
                        className="w-full mt-8"
                        size="xl"
                        onPress={handleSubmit}>
                        {isPending && <SpinningLoader />}
                        <ButtonText>Reset Password</ButtonText>
                    </Button>
                </Box>
            </BottomSheet>
        </>
    );
}
