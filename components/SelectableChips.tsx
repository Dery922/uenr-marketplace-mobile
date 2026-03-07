// components/SelectableChips.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const SelectableChips = ({
  options = [],
  selectedValue,
  onSelect,
  type = 'radio', // 'radio' or 'checkbox'
  layout = 'horizontal', // 'horizontal' or 'vertical'
  chipStyle = 'outline', // 'outline', 'filled', or 'pill'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  error = '',
  label = '',
  required = false,
  iconPosition = 'left', // 'left' or 'right' (for checkbox type)
}) => {
  
  const getChipSize = () => {
    switch (size) {
      case 'sm': return { padding: 8, fontSize: 12, iconSize: 16 };
      case 'lg': return { padding: 16, fontSize: 16, iconSize: 24 };
      default: return { padding: 12, fontSize: 14, iconSize: 20 };
    }
  };

  const chipSize = getChipSize();

  const getChipStyle = (isSelected) => {
    if (disabled) {
      return styles.chipDisabled;
    }
    
    if (chipStyle === 'filled') {
      return isSelected ? styles.chipFilledSelected : styles.chipFilled;
    }
    
    if (chipStyle === 'pill') {
      return isSelected ? styles.chipPillSelected : styles.chipPill;
    }
    
    // Default outline style
    return isSelected ? styles.chipOutlineSelected : styles.chipOutline;
  };

  const getTextStyle = (isSelected) => {
    if (disabled) {
      return styles.textDisabled;
    }
    
    if (chipStyle === 'filled') {
      return isSelected ? styles.textFilledSelected : styles.textFilled;
    }
    
    if (chipStyle === 'pill') {
      return isSelected ? styles.textPillSelected : styles.textPill;
    }
    
    // Default outline
    return isSelected ? styles.textOutlineSelected : styles.textOutline;
  };

  const renderRadioIcon = (isSelected) => {
    if (disabled) return null;
    
    return (
      <Ionicons 
        name={isSelected ? 'radio-button-on' : 'radio-button-off'} 
        size={chipSize.iconSize}
        color={isSelected ? '#00BFFF' : '#A0AEC0'}
        style={styles.icon}
      />
    );
  };

  const renderCheckboxIcon = (isSelected, optionValue) => {
    if (disabled) return null;
    
    const isChecked = selectedValue === optionValue || 
                     (Array.isArray(selectedValue) && selectedValue.includes(optionValue));
    
    if (iconPosition === 'left') {
      return (
        <Ionicons 
          name={isChecked ? 'checkbox' : 'square-outline'} 
          size={chipSize.iconSize}
          color={isChecked ? '#00BFFF' : '#A0AEC0'}
          style={styles.icon}
        />
      );
    } else {
      return (
        <Ionicons 
          name={isChecked ? 'checkmark-circle' : 'ellipse-outline'} 
          size={chipSize.iconSize}
          color={isChecked ? '#00BFFF' : '#A0AEC0'}
          style={styles.iconRight}
        />
      );
    }
  };

  const handleSelect = (option) => {
    if (disabled) return;
    
    if (type === 'radio') {
      onSelect(option.value);
    } else {
      // For checkbox, handle array selection
      const currentSelection = Array.isArray(selectedValue) ? selectedValue : [];
      let newSelection;
      
      if (currentSelection.includes(option.value)) {
        newSelection = currentSelection.filter(v => v !== option.value);
      } else {
        newSelection = [...currentSelection, option.value];
      }
      
      onSelect(newSelection);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}
      
      <View style={[
        styles.optionsContainer,
        layout === 'vertical' ? styles.verticalLayout : styles.horizontalLayout,
      ]}>
        {options.map((option, index) => {
          const isSelected = type === 'radio' 
            ? selectedValue === option.value
            : Array.isArray(selectedValue) && selectedValue.includes(option.value);
          
          return (
            <TouchableOpacity
              key={option.value || index}
              style={[
                styles.chip,
                getChipStyle(isSelected),
                { paddingHorizontal: chipSize.padding, paddingVertical: chipSize.padding / 1.5 },
                layout === 'vertical' && styles.chipVertical,
              ]}
              onPress={() => handleSelect(option)}
              disabled={disabled || option.disabled}
              activeOpacity={0.7}
            >
              {type === 'radio' && renderRadioIcon(isSelected)}
              {type === 'checkbox' && renderCheckboxIcon(isSelected, option.value)}
              <Text style={[
                getTextStyle(isSelected),
                { fontSize: chipSize.fontSize },
                (iconPosition === 'left' || type === 'radio') ? styles.textWithIconLeft : styles.textWithIconRight,
              ]}>
                {option.label}
              </Text>
              {option.count && (
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{option.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
  },
  required: {
    color: '#FF4444',
    fontSize: 16,
    marginLeft: 4,
  },
  optionsContainer: {
    flexWrap: 'wrap',
  },
  horizontalLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalLayout: {
    flexDirection: 'column',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  chipVertical: {
    width: '100%',
    marginRight: 0,
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
  
  // Outline styles
  chipOutline: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  chipOutlineSelected: {
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    borderColor: '#00BFFF',
  },
  textOutline: {
    color: '#4A5568',
  },
  textOutlineSelected: {
    color: '#00BFFF',
    fontWeight: '600',
  },
  
  // Filled styles
  chipFilled: {
    backgroundColor: '#F7FAFC',
    borderColor: '#E2E8F0',
  },
  chipFilledSelected: {
    backgroundColor: '#00BFFF',
    borderColor: '#00BFFF',
  },
  textFilled: {
    color: '#4A5568',
  },
  textFilledSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Pill styles (rounded)
  chipPill: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 20,
  },
  chipPillSelected: {
    backgroundColor: '#00BFFF',
    borderColor: '#00BFFF',
    borderRadius: 20,
  },
  textPill: {
    color: '#4A5568',
  },
  textPillSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Disabled styles
  chipDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.5,
  },
  textDisabled: {
    color: '#A0AEC0',
  },
  
  textWithIconLeft: {
    marginLeft: 0,
  },
  textWithIconRight: {
    marginRight: 6,
  },
  
  // Count badge
  countBadge: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  countText: {
    fontSize: 10,
    color: '#4A5568',
    fontWeight: '600',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 4,
  },
});

export default SelectableChips;