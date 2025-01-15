import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/Roboto-Regular.ttf" },
    { src: "/fonts/Roboto-Bold.ttf" },
  ],
});

// Define styles
const styles = StyleSheet.create({
  document: {
    padding: 20,
    backgroundColor: "#F5F5F5", 
  },
  page: {
    padding: 40, 
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start", 
    alignItems: "stretch", 
  },
  title: {
    fontFamily: "Roboto",
    color: "#333333",
    marginBottom: 24,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: 24, 
  },
  cardBody: {
    fontSize: 16,
    lineHeight: 1.5, 
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#555555",
  },
  field: {
    marginBottom: 16,
    fontSize: 14,
    color: "#000000",
  },
});

export default function pdfSickLeave({ sickLeave }) {
  return (
    <Document style={styles.document}>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <Text style={styles.title}>Sick Leave Details</Text>
          <View style={styles.card}>
            <View style={styles.cardBody}>
              <Text style={styles.field}>
                <Text style={styles.label}>Name: </Text> {sickLeave.patientName}
              </Text>
              <Text style={styles.field}>
                <Text style={styles.label}>Duration (Days): </Text>
                {sickLeave.duration}
              </Text>
              <Text style={styles.field}>
                <Text style={styles.label}>Start Date: </Text>
                {new Date(sickLeave.startDate).toLocaleDateString()}
              </Text>
              <Text style={styles.field}>
                <Text style={styles.label}>End Date: </Text>
                {new Date(sickLeave.endDate).toLocaleDateString()}
              </Text>
              <Text style={styles.field}>
                <Text style={styles.label}>Reason: </Text> {sickLeave.reason}
              </Text>
              <Text style={styles.field}>
                <Text style={styles.label}>Created At: </Text>
                {new Date(sickLeave.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
