import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MenuSeleccionProps {
  onSeleccionarManual: () => void;
  onSeleccionarAutomatico: () => void;
}

export default function MenuSeleccion({
  onSeleccionarManual,
  onSeleccionarAutomatico,
}: MenuSeleccionProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🎲</Text>
        <Text style={styles.title}>Lotería Campechana</Text>
        <Text style={styles.subtitle}>Selecciona el modo de juego</Text>
      </View>

      {/* Opciones */}
      <View style={styles.optionsContainer}>
        {/* Opción Manual */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={onSeleccionarManual}
          activeOpacity={0.8}
        >
          <View style={styles.optionIcon}>
            <Text style={styles.optionEmoji}>👆</Text>
          </View>
          <Text style={styles.optionTitle}>MANUAL</Text>
          <Text style={styles.optionDescription}>
            Controla cada giro.{"\n"}
            Presiona el botón para{"\n"}
            cantar cada número.
          </Text>
          <View style={styles.optionBadge}>
            <Text style={styles.badgeText}>Para ti</Text>
          </View>
        </TouchableOpacity>

        {/* Opción Automático */}
        <TouchableOpacity
          style={[styles.optionCard, styles.optionCardAuto]}
          onPress={onSeleccionarAutomatico}
          activeOpacity={0.8}
        >
          <View style={[styles.optionIcon, styles.optionIconAuto]}>
            <Text style={styles.optionEmoji}>⚡</Text>
          </View>
          <Text style={styles.optionTitle}>AUTOMÁTICO</Text>
          <Text style={styles.optionDescription}>
            Canta números solo.{"\n"}
            Controla velocidad y{"\n"}
            pausa cuando quieras.
          </Text>
          <View style={[styles.optionBadge, styles.badgeAuto]}>
            <Text style={styles.badgeText}>Recomendado</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer informativo */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Tip: Puedes cambiar de modo en cualquier momento
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a472a",
    paddingTop: 60,
  },

  // HEADER
  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#f4e5d3",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#d4af37",
    marginTop: 10,
  },

  // OPCIONES
  optionsContainer: {
    flexDirection: "column",
    paddingHorizontal: 40,
    gap: 20,
    marginBottom: 40,
  },
  optionCard: {
    // flex: 1,
    backgroundColor: "#0f2818",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#d4af37",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  optionCardAuto: {
    backgroundColor: "#234d32",
    borderColor: "#ffd700",
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "#8f7520",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  optionIconAuto: {
    backgroundColor: "#8f7520",
  },
  optionEmoji: {
    fontSize: 20,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f4e5d3",
    marginBottom: 10,
  },
  optionDescription: {
    fontSize: 14,
    color: "#d4af37",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 15,
  },
  optionBadge: {
    backgroundColor: "#8b4513",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: "auto",
  },
  badgeAuto: {
    backgroundColor: "#ff6b35",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  // FOOTER
  footer: {
    alignItems: "center",
    paddingHorizontal: 30,
  },
  footerText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
  },
});
