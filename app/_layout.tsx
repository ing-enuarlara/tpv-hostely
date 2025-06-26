import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, View, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { removeItem } from '../utils/storage';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
	const router = useRouter();
	const segments = useSegments();

	const joinedPath = segments.join('/');

	const hiddenBackRoutes = ['', 'tpv'];
	const isHomeTPV = joinedPath === 'tpv/[tpvId]';
	const shouldShowBack = router.canGoBack() && !hiddenBackRoutes.includes(joinedPath);
	const shouldShowLogout = joinedPath.startsWith('tpv/');

	useEffect(() => {
		const cargar = async () => {
			try {
				await new Promise(res => setTimeout(res, 1500));
			} catch (e) {
				console.warn('Error al cargar splash:', e);
			} finally {
				await SplashScreen.hideAsync();
			}
		};

		cargar();
	}, []);

	const cerrarSesion = async () => {
		if (Platform.OS === 'web') {
			const confirmed = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
			if (confirmed) {
				await removeItem('tpvId');
				await removeItem('sedeId');
				router.replace('/');
			}
		} else {
			Alert.alert(
				'Cerrar sesión',
				'¿Estás seguro de que deseas cerrar sesión?',
				[
					{ text: 'Cancelar', style: 'cancel' },
					{
						text: 'Sí',
						onPress: async () => {
							await removeItem('tpvId');
							await removeItem('sedeId');
							router.replace('/');
						},
					},
				]
			);
		}
	};

	return (
		<SafeAreaProvider>
			<Slot />
			<StatusBar style="auto" />

			{(shouldShowBack || shouldShowLogout) && (
				<View style={styles.navigationContainer}>
					{shouldShowBack && (
						<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
							<Ionicons name="arrow-back" size={24} color="#15314c" />
						</TouchableOpacity>
					)}

					<TouchableOpacity onPress={() => router.push('/')} style={styles.homeButton}>
						<Ionicons name="home" size={28} color="#15314c" />
					</TouchableOpacity>

					{shouldShowLogout && (
						<TouchableOpacity onPress={cerrarSesion} style={styles.logoutButton}>
							<Ionicons name="log-out-outline" size={24} color="#15314c" />
						</TouchableOpacity>
					)}
				</View>
			)}
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	navigationContainer: {
		position: 'absolute',
		bottom: 20,
		left: 20,
		right: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		zIndex: 99,
	},
	backButton: {
		backgroundColor: '#ffffff',
		padding: 10,
		borderRadius: 12,
		elevation: 2,
	},
	homeButton: {
		backgroundColor: '#ffffff',
		padding: 12,
		borderRadius: 50,
		elevation: 2,
	},
	logoutButton: {
		backgroundColor: '#ffffff',
		padding: 10,
		borderRadius: 12,
		elevation: 2,
	},
});
