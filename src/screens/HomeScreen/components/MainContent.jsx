import React from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { darkTheme, darkSpacing, darkBorderRadius, darkFontSizes, darkFontWeights } from '../../../shared/ui/darkTheme';

const MainContent = () => {
  const { navigate } = useNavigation();
  
  const handleEditVideo = () => {
    navigate('editor');
  };
  
  const handleRecordDemo = () => {
    navigate('recordings');
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>🎬</span>
        </div>
        
        <h1 style={styles.heading} className="text-white">What do you want to do?</h1>
        
        <div style={styles.buttonContainer}>
          <button
            style={styles.actionCard}
            onClick={handleEditVideo}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkTheme.cardHover;
              e.currentTarget.style.borderColor = darkTheme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = darkTheme.card;
              e.currentTarget.style.borderColor = darkTheme.border;
            }}
          >
            <div style={styles.cardIcon}>✂️</div>
            <div style={styles.cardContent}>
              <div style={styles.cardTitle}>Edit a video</div>
              <div style={styles.cardDescription}>
                Import and edit your video clips
              </div>
            </div>
          </button>
          
          <button
            style={styles.actionCard}
            onClick={handleRecordDemo}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkTheme.cardHover;
              e.currentTarget.style.borderColor = darkTheme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = darkTheme.card;
              e.currentTarget.style.borderColor = darkTheme.border;
            }}
          >
            <div style={styles.cardIcon}>🎥</div>
            <div style={styles.cardContent}>
              <div style={styles.cardTitle}>Record a quick demo</div>
              <div style={styles.cardDescription}>
                Capture your screen and create a demo
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: darkSpacing.xxxl,
    overflow: 'hidden',
  },
  content: {
    maxWidth: '800px',
    width: '100%',
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: darkSpacing.xl,
  },
  icon: {
    fontSize: '64px',
    display: 'inline-block',
  },
  heading: {
    fontSize: darkFontSizes.xxxxl,
    fontWeight: darkFontWeights.semibold,
    color: darkTheme.text,
    marginBottom: darkSpacing.xxxxl,
    letterSpacing: '-0.02em',
  },
  buttonContainer: {
    display: 'flex',
    gap: darkSpacing.xl,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: darkSpacing.lg,
    padding: darkSpacing.xxl,
    backgroundColor: darkTheme.card,
    border: `2px solid ${darkTheme.border}`,
    borderRadius: darkBorderRadius.lg,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '320px',
    textAlign: 'left',
  },
  cardIcon: {
    fontSize: '48px',
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: darkFontSizes.xl,
    fontWeight: darkFontWeights.semibold,
    color: darkTheme.text,
    marginBottom: darkSpacing.xs,
  },
  cardDescription: {
    fontSize: darkFontSizes.sm,
    color: darkTheme.textSecondary,
    lineHeight: 1.5,
  },
};

export default MainContent;

