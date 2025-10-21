import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type ProgramCardProps = {
  image: string
  title: string
  description: string
  status: string
  completed: number
  currentWeek: number
  totalWeek: number
  actionText: string
  statusColor: string
  onPress?: () => void
}

const ProgramCard = ({
  image,
  title,
  description,
  status,
  completed,
  currentWeek,
  totalWeek,
  actionText,
  statusColor,
  onPress,
}: ProgramCardProps) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={[styles.statusTag, { backgroundColor: `${statusColor}1A` }]}>
          <Text style={{ color: statusColor, fontSize: 12 }}>{status}</Text>
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${completed}%` }]} />
        </View>
        <View style={styles.progressText}>
          <Text style={styles.progressLabel}>Hoàn thành: {completed}%</Text>
          <Text style={styles.progressLabel}>
            Tuần: {currentWeek}/{totalWeek}
          </Text>
        </View>

        <TouchableOpacity style={styles.cardButton} onPress={onPress}>
          <Text style={styles.cardButtonText}>{actionText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProgramCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    height: 160,
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  statusTag: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#555',
    marginBottom: 12,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2F80ED',
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
  },
  cardButton: {
    backgroundColor: '#2F80ED',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
})
