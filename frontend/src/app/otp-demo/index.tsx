
import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Keyboard,
    Platform,
    ActivityIndicator,
} from 'react-native';

import {
    generateOtp,
    verifyOtp,
    resendOtp,
} from '../../services/otpService';

// Alert.alert doesn't show on web — use this helper instead
const showMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') {
        window.alert(`${title}\n\n${message}`);
    } else {
        Alert.alert(title, message);
    }
};

const OtpDemo = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [demoOtp, setDemoOtp] = useState<string | null>(null);

    // Countdown timer
    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    // Generate OTP
    const handleGenerateOtp = async () => {
        if (!/^[6-9]\d{9}$/.test(phone)) {
            Alert.alert('Invalid Number', 'Enter a valid 10-digit mobile number');
            return;
        }

        try {
            setLoading(true);
            console.log('Sending OTP request for:', phone);

            const response = await generateOtp(phone);
            console.log('OTP response:', response);

            setOtp('');
            setOtpSent(true);
            setTimer(60);
            setDemoOtp(response.demoOtp);

            showMessage('Demo OTP', response.demoOtp);

        } catch (error: any) {
            console.log('OTP Error:', error.response?.data || error.message);
            showMessage('Error', error.response?.data?.message || 'OTP generation failed');
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            Alert.alert('Invalid OTP', 'Enter the 6-digit OTP');
            return;
        }

        try {
            setLoading(true);
            Keyboard.dismiss();

            const response = await verifyOtp(phone, otp);

            showMessage(
                response.success ? 'Success' : 'Failed',
                response.message
            );

            if (response.verified) {
                setOtpSent(false);
                setTimer(0);
                setOtp('');
                setDemoOtp(null);
            }

        } catch (error: any) {
            showMessage(
                'Verification Failed',
                error.response?.data?.message || 'Invalid OTP'
            );
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        try {
            setLoading(true);

            const response = await resendOtp(phone);

            setOtp('');
            setTimer(60);
            setDemoOtp(response.demoOtp);

            showMessage('New Demo OTP', response.demoOtp);

        } catch (error: any) {
            showMessage(
                'Resend Failed',
                error.response?.data?.message || 'Please try again later'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.card}>

                <Text style={styles.title}>
                    OTP Verification
                </Text>

                <Text style={styles.subtitle}>
                    Enter your mobile number to generate OTP
                </Text>

                {/* Mobile Number */}
                <Text style={styles.label}>
                    Mobile Number
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter 10-digit mobile number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                />

                {/* Generate OTP */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        loading && styles.disabledButton
                    ]}
                    onPress={handleGenerateOtp}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Please wait...' : 'Generate OTP'}
                    </Text>
                </TouchableOpacity>

                {demoOtp && (
                    <View style={styles.demoCard}>
                        <Text style={styles.demoLabel}>DEMO OTP</Text>
                        <Text style={styles.demoOtp}>{demoOtp}</Text>
                        <Text style={styles.demoHint}>
                            Shown for learning only — no SMS sent
                        </Text>
                    </View>
                )}

                {otpSent && (
                    <>
                        <Text style={styles.label}>
                            Enter OTP
                        </Text>

                        {/* OTP Input */}
                        <TextInput
                            style={[styles.input, styles.otpInput]}
                            placeholder="Enter 6-digit OTP"
                            placeholderTextColor="#999"
                            keyboardType="number-pad"
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                            textContentType="oneTimeCode"
                            autoComplete="sms-otp"
                        />

                        {/* Timer */}
                        <View style={styles.timerContainer}>
                            {timer > 0 ? (
                                <Text style={styles.timer}>
                                    Resend OTP in {timer}s
                                </Text>
                            ) : (
                                <TouchableOpacity
                                    onPress={handleResendOtp}
                                    disabled={loading}
                                >
                                    <Text style={styles.resendText}>
                                        Resend OTP
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Verify */}
                        <TouchableOpacity
                            style={styles.verifyButton}
                            onPress={handleVerifyOtp}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                Verify OTP
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F5FA',
        justifyContent: 'center',
        padding: 20,
    },

    card: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },

    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#172554',
        textAlign: 'center',
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 25,
    },

    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
        marginTop: 12,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        paddingHorizontal: 14,
        fontSize: 16,
        color: '#172554',
        backgroundColor: '#FFFFFF',
    },

    otpInput: {
        textAlign: 'center',
        letterSpacing: 8,
        fontSize: 20,
    },

    button: {
        height: 50,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },

    verifyButton: {
        height: 50,
        backgroundColor: '#16A34A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 15,
    },

    disabledButton: {
        opacity: 0.6,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    timerContainer: {
        alignItems: 'center',
        marginTop: 15,
    },

    timer: {
        fontSize: 14,
        color: '#64748B',
    },

    resendText: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: 'bold',
    },
    demoCard: {
        backgroundColor: '#FEF3C7',
        borderWidth: 2,
        borderColor: '#F59E0B',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 15,
        marginTop: 20,
        alignItems: 'center',
    },
    demoLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#92400E',
        textTransform: 'uppercase',
    },
    demoOtp: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 6,
        color: '#78350F',
        marginVertical: 6,
    },
    demoHint: {
        fontSize: 11,
        color: '#92400E',
        fontStyle: 'italic',
    },
});

export default OtpDemo;
