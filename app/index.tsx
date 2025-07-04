import { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { setItem, getItem } from '../utils/storage';
import api from '../services/api';

export default function Index() {
    const [clave, setClave] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkTPV = async () => {
            const stored = await getItem('tpvId');
            if (stored) {
                const id = JSON.parse(stored);
                router.replace(`/tpv/${id}`);
            }
        };
        checkTPV();
    }, []);

    const handleAcceder = async () => {
        if (!clave.trim()) {
            Alert.alert('Error', 'Introduce una clave');
            return;
        }

        try {
            setLoading(true);
            const res = await api.post(`/api/tpv/acceso`, { clave: clave.trim() });
            const tpv = res.data;

            if (!tpv || !tpv.id) throw new Error('TPV inválido');
            await setItem('tpvId', JSON.stringify(tpv.id));

            // Redirige al TPV correspondiente
            router.replace(`/tpv/${tpv.id}`);
        } catch (err) {
            console.error(err);
            Alert.alert('Acceso denegado', 'Clave incorrecta o TPV inactivo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Acceso a TPV Hostely</Text>
            <TextInput
                placeholder="Clave de acceso"
                value={clave}
                onChangeText={setClave}
                secureTextEntry
                style={styles.input}
                editable={!loading}
            />
            <Button title="Entrar" onPress={handleAcceder} disabled={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#15314c'
    },
    title: {
        fontSize: 22,
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        color: '#fff',
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16
    }
});