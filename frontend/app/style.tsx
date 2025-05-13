
import {
  

  StyleSheet,
  
} from "react-native";



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flex: 1 },
  headerText: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  infoText: { color: "#e0e0e0", marginTop: 4, fontSize: 13 },
  headerRight: { flexDirection: "row", gap: 10 },
  iconBtn: { padding: 4 },
  adContainer: {
    height: 60,
    justifyContent: "center",
    marginTop: 10,
    overflow: "hidden",
    paddingHorizontal: 10,
  },
  adContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adImage: { width: 45, height: 45, marginRight: 10, borderRadius: 8 },
  adText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 14,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 16,
    width: 260,
    elevation: 6,
  },
  cardImage: { width: "100%", height: 150 },
  cardContent: { padding: 12 },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  cardDescription: { fontSize: 13, color: "#777", lineHeight: 18 },
  cardRating: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#f1c40f",
    marginTop: 6,
  },
  starContainer: { flexDirection: "row", marginTop: 6, gap: 4 },
  filledStar: { color: "#f1c40f", fontSize: 18 },
  emptyStar: { color: "#ccc", fontSize: 18 },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sidePanel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "70%",
    backgroundColor: "transparent",
    zIndex: 999,
  },
  sidePanelBackground: {
    flex: 1,
    padding: 10,
    justifyContent: "flex-start",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 998,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  searchHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 20,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 4,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
});

export default styles