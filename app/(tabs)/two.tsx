import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useThemeStore();
  const logout = useAuthStore((state) => state.logout);

  const actualIsDark = !!isDark;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <View style={[styles.container, actualIsDark && styles.darkContainer]}>
      <Text style={[styles.title, actualIsDark && styles.darkText]}>
        Settings
      </Text>

      <View style={styles.setting}>
        <Text style={[styles.settingText, actualIsDark && styles.darkText]}>
          Dark Mode
        </Text>
        <Switch
          value={actualIsDark}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={actualIsDark ? "#007AFF" : "#f4f3f4"}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  darkContainer: {
    backgroundColor: "#1A1A1A",
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  darkText: {
    color: "#fff",
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: "#AA1130",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
});
