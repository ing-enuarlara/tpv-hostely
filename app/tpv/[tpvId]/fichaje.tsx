import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { setItem, getItem } from '../../../utils/storage';
import api from '../../../services/api';
import CryptoJS from 'crypto-js';

interface Empleado {
    id: number;
    nombre: string;
    fotoPerfil?: string;
}

export default function FichajeScreen() {
    const router = useRouter();
    const { tpvId } = useLocalSearchParams();
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [sedeId, setSedeId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerSedeId = async () => {
            const id = await getItem('sedeId');
            setSedeId(id);
        };
        obtenerSedeId();
    }, []);

    useEffect(() => {
        const cargarEmpleados = async () => {
            try {
                const response = await api.get(`/api/tpv/${tpvId}/empleados`);
                setEmpleados(response.data);
            } catch (error) {
                console.error('Error al cargar empleados:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarEmpleados();
    }, [tpvId]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#1976d2" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecciona tu perfil</Text>

            <View style={styles.listWrapper}>
                <FlatList
                    data={empleados}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.content}
                    renderItem={({ item }) => {
                        if (!sedeId) return null;
                        const data = {
                            usuarioId: item.id,
                            sedeId,
                            tpvId,
                        };

                        const key = CryptoJS.enc.Utf8.parse(process.env.EXPO_PUBLIC_SECRET_KEY || 'hostelydefault');
                        const iv = CryptoJS.enc.Utf8.parse('0000000000000000'); // 16 bytes

                        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7,
                        }).toString();

                        const href = {
                            pathname: "/tpv/[tpvId]/fichaje/[usuarioId]",
                            params: {
                                tpvId: String(tpvId),
                                usuarioId: String(item.id),
                                token: encodeURIComponent(encrypted),
                            },
                        } as const;

                        return (
                            <Link href={href} asChild>
                                <TouchableOpacity style={styles.card}>
                                    <Image
                                        source={
                                            item.fotoPerfil
                                                ? { uri: item.fotoPerfil }
                                                : require('../../../assets/avatar.png')
                                        }
                                        style={styles.avatar}
                                    />
                                    <Text style={styles.name}>{item.nombre}</Text>
                                </TouchableOpacity>
                            </Link>
                        );
                    }}
                />
            </View>
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
        paddingHorizontal: 20,
        paddingTop: 40, // para separar del top
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 32,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listWrapper: {
        flex: 1,
        width: '100%',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 32,
    },
    card: {
        width: 140,
        height: 160,
        margin: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
    },
    name: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
});