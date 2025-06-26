import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import CryptoJS from 'crypto-js';

export default function EmpleadoQR() {
    const { tpvId, usuarioId, token } = useLocalSearchParams();
    const [sedeId, setSedeId] = useState<string | null>(null);
    const [qrValue, setQrValue] = useState('');
    const [timer, setTimer] = useState(30);
    const [loading, setLoading] = useState(true);
    const key = CryptoJS.enc.Utf8.parse(process.env.EXPO_PUBLIC_SECRET_KEY || 'hostelydefault');
    const iv = CryptoJS.enc.Utf8.parse('0000000000000000');

    const desencriptarToken = () => {
        try {
            const bytes = CryptoJS.AES.decrypt(token as string, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });

            const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decrypted?.sedeId || null;
        } catch (err) {
            console.error('Token inválido o corrupto');
            return null;
        }
    };

    const generarQR = () => {
        const payload = {
            sedeId,
            timestamp: Date.now(),
        };
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }).toString();
        const url = `https://front-hostely-web.vercel.app/ficharEmpleado?token=${encodeURIComponent(encrypted)}`;
        setQrValue(url);
    };

    useEffect(() => {
        const id = desencriptarToken();
        if (!id) return;
        setSedeId(id);
        setLoading(false);
    }, [token]);

    useEffect(() => {
        if (!sedeId) return;

        generarQR();
        const interval = setInterval(() => {
            generarQR();
            setTimer(30);
        }, 30000);

        return () => clearInterval(interval);
    }, [sedeId]);

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(countdown);
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#1976d2" />
                {!token || !sedeId && (
                    <Text style={styles.error}>Token inválido o corrupto</Text>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Escanea para fichar</Text>
            {qrValue ? (
                <>
                    <QRCode value={qrValue} size={240} />
                    <Text style={styles.timer}>Código se actualiza en: {timer}s</Text>
                </>
            ) : (
                <Text style={styles.error}>Error al generar QR</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#15314c' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, marginBottom: 30, fontWeight: 'bold', color: '#fff' },
    timer: { marginTop: 20, color: '#777' },
    error: { marginTop: 20, color: 'red' },
});