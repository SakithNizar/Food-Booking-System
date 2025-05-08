import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../config/axiosConfig";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
    color: "#333",
  },
  section: {
    marginBottom: 30,
    borderBottom: "1 solid #ccc",
    paddingBottom: 12,
  },
  heading: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
    textTransform: "uppercase",
  },
  subheading: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#444",
    textDecoration: "underline",
  },
  label: {
    fontWeight: "bold",
    color: "#000",
  },
  text: {
    marginBottom: 4,
  },
  foodItem: {
    marginBottom: 20,
    padding: 12,
    border: "1 solid #007ACC",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    hover: {
      boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.2)",
    },
  },
  foodItemText: {
    marginBottom: 6,
  },
  foodItemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  foodItemDescription: {
    fontSize: 12,
    color: "#666",
  },
  image: {
    width: 120,
    height: 90,
    marginTop: 10,
    borderRadius: 4,
    border: "1 solid #ddd",
  },
  foodDetails: {
    marginTop: 8,
    fontSize: 12,
    color: "#555",
  },
  footerNote: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  overviewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  overviewBox: {
    width: "30%",
    padding: 10,
    border: "1 solid #ccc",
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
    textAlign: "center",
  },
  overviewTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 16,
    color: "#007ACC",
  },
});

const CateringReportPDF = () => {
  const [reportData, setReportData] = useState(null);

  const getReportData = async () => {
    try {
      const response = await axiosInstance.get("/report-data");
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  useEffect(() => {
    getReportData();
  }, []);

  if (!reportData) return <p>Loading PDF...</p>;

  return (
    <PDFViewer width="100%" height="1000">
      <Document>
        <Page size="A4" style={styles.page}>
          {/* 🧾 Report Title */}
          <Text style={styles.heading}>Catering Report Summary</Text>

          {/* 📊 Statistics Section */}
          <View style={styles.section}>
            <Text style={styles.subheading}>Overview</Text>
            <View style={styles.overviewContainer}>
              <View style={styles.overviewBox}>
                <Text style={styles.overviewTitle}>Total Foods</Text>
                <Text style={styles.overviewValue}>
                  {reportData.statistics.totalFoods}
                </Text>
              </View>
              <View style={styles.overviewBox}>
                <Text style={styles.overviewTitle}>Total Categories</Text>
                <Text style={styles.overviewValue}>
                  {reportData.statistics.totalCategories}
                </Text>
              </View>
              <View style={styles.overviewBox}>
                <Text style={styles.overviewTitle}>Total Time Slots</Text>
                <Text style={styles.overviewValue}>
                  {reportData.statistics.totalTimeSlots}
                </Text>
              </View>
            </View>
          </View>

          {/* 📂 Foods by Category */}
          <View style={styles.section}>
            <Text style={styles.subheading}>Foods Grouped by Category</Text>
            {reportData.categories.map((category, idx) => (
              <View key={idx}>
                <Text style={styles.subheading}>{category.name}</Text>
                {category.foods.map((food, fidx) => (
                  <View key={fidx} style={styles.foodItem}>
                    <Text style={styles.foodItemTitle}>{food.name}</Text>
                    <Text style={styles.foodItemDescription}>
                      {food.description}
                    </Text>
                    <Text style={styles.foodDetails}>
                      <Text style={styles.label}>Available Times: </Text>
                      {food.time.join(", ")}
                    </Text>
                    {food.picture && (
                      <Image src={food.picture} style={styles.image} />
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* ⏰ Foods by Time Slot */}
          <View style={styles.section}>
            <Text style={styles.subheading}>Foods Grouped by Time Slot</Text>
            {reportData.timeSlots.map((slot, idx) => (
              <View key={idx}>
                <Text style={styles.subheading}>
                  {slot.name} ({slot.startTime} - {slot.endTime})
                </Text>
                {slot.foods.map((food, fidx) => (
                  <View key={fidx} style={styles.foodItem}>
                    <Text style={styles.foodItemTitle}>{food.name}</Text>
                    <Text style={styles.foodItemDescription}>
                      {food.description}
                    </Text>
                    <Text style={styles.foodDetails}>
                      <Text style={styles.label}>Belongs to Categories: </Text>
                      {food.category.join(", ")}
                    </Text>
                    {food.picture && (
                      <Image src={food.picture} style={styles.image} />
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* 📝 Footer */}
          <Text style={styles.footerNote}>
            Generated by Salo Catering System ·{" "}
            {new Date().toLocaleDateString()}
          </Text>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default CateringReportPDF;
