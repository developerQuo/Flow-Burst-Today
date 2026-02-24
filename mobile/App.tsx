import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

const WEBVIEW_BASE_URL =
  process.env.EXPO_PUBLIC_WEBVIEW_BASE_URL ?? "http://127.0.0.1:3000";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <WebView
        source={{ uri: WEBVIEW_BASE_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={["*"]}
        allowsBackForwardNavigationGestures={true}
        // iOS에서 localhost 접근 허용
        {...(Platform.OS === "ios" && {
          allowsInlineMediaPlayback: true,
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
});
