import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { setItem, getItem } from '../../utils/storage';
import api from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function TPVHome() {
    const { tpvId } = useLocalSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const checkTPV = async () => {
            const stored = await getItem('tpvId');
            if (!stored) {
                Alert.alert('Acceso inválido', 'No se encontró una sesión activa');
                router.replace('/');
            }
        };
        checkTPV();
    }, []);

    useEffect(() => {
        const consultarTPV = async () => {
            try {
                const response = await api.get(`/api/tpv/${tpvId}`);
                await setItem('sedeId', JSON.stringify(response.data.sedeId));
            } catch (err) {
                console.error('Error al cargar TPV:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        consultarTPV();
    }, [tpvId]);

    const irAFichaje = () => {
        router.push(`/tpv/${tpvId}/fichaje`);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#1976d2" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>TPV inválida</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿Qué deseas hacer hoy?</Text>
            <TouchableOpacity style={styles.card} onPress={irAFichaje}>
                <Ionicons name="qr-code-outline" size={80} color="#15314c" />
                <Text style={styles.text}>Fichaje</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#15314c' },
    container: {
        flex: 1,
        backgroundColor: '#15314c',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 32,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        padding: 40,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    text: {
        fontSize: 22,
        color: '#15314c',
        marginTop: 12,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 20,
        color: 'red',
    },
});