// app/(tabs)/privacy.js
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  const sections = [
    {
      id: 'information',
      title: 'Information We Collect',
      icon: 'information-circle-outline',
      color: '#00BFFF',
      content: [
        {
          subtitle: 'Personal Information',
          details: [
            'Full name and student ID number',
            'Email address (@uenr.edu.gh domain)',
            'Phone number and campus location',
            'Profile photo (optional)',
            'Year of study and department',
          ],
        },
        {
          subtitle: 'Transaction Information',
          details: [
            'Products listed for sale',
            'Purchase history and receipts',
            'Payment method details (encrypted)',
   
          ],
        },
        {
          subtitle: 'Technical Information',
          details: [
            'Device type and operating system',
            'Cookies and session data',
            'Crash reports and performance data',
          ],
        },
      ],
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: 'analytics-outline',
      color: '#38B2AC',
      content: [
        {
          subtitle: 'Core Platform Functions',
          details: [
            'Verify student status and eligibility',
            'Facilitate buying and selling transactions',
          
            'Communicate order updates',
            'Prevent fraud and unauthorized access',
          ],
        },
        {
          subtitle: 'Platform Improvement',
          details: [
            'Analyze usage patterns to improve features',
            'Personalize your marketplace experience',
            'Develop new services and tools',
            'Optimize search and recommendation algorithms',
          ],
        },
        {
          subtitle: 'Communication',
          details: [
            'Send transaction confirmations and receipts',
        
            'Share platform updates and announcements',
            'Respond to support inquiries',
          ],
        },
      ],
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      icon: 'share-outline',
      color: '#9F7AEA',
      content: [
        {
          subtitle: 'We Share With',
          details: [
            'Other users: Your public profile and listings',
            'Printing presses: Documents and order details',
            'Payment processors: Transaction information',
            'University administration: For policy enforcement',
          ],
        },
        {
          subtitle: 'We Do NOT Share With',
          details: [
            'Third-party advertisers',
            'External marketing companies',
            'Data brokers or analytics firms (without consent)',
            'Unauthorized researchers or organizations',
          ],
        },
        {
          subtitle: 'Legal Requirements',
          details: [
            'Comply with court orders or legal processes',
            'Protect against fraud or security risks',
            'Enforce our Terms & Conditions',
            'Respond to emergency situations',
          ],
        },
      ],
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: 'shield-checkmark-outline',
      color: '#48BB78',
      content: [
        {
          subtitle: 'Security Measures',
          details: [
            'End-to-end encryption for payment data',
            'Secure servers with firewall protection',
            'Regular security audits and penetration testing',
            'Two-factor authentication option',
            'Automatic logout after inactivity',
          ],
        },
        {
          subtitle: 'Data Retention',
          details: [
            'Active accounts: Data retained while account is active',
            'Deleted accounts: Data removed within 30 days',
            'Transaction records: Retained for 3 years (legal requirement)',
            'Chat messages: Deleted after 90 days',
            'Uploaded documents: Automatically deleted after 7 days',
          ],
        },
      ],
    },
    {
      id: 'rights',
      title: 'Your Privacy Rights',
      icon: 'document-text-outline',
      color: '#ED8936',
      content: [
        {
          subtitle: 'You Have The Right To',
          details: [
            'Access all personal data we hold about you',
            'Correct inaccurate or incomplete information',
            'Delete your account and associated data',
            'Opt-out of marketing communications',
            'Export your data in a portable format',
            'Lodge a complaint with data protection authorities',
          ],
        },
        {
          subtitle: 'How to Exercise Your Rights',
          details: [
            'Email: privacy@uenrmarketplace.com',
            'In-app: Settings → Privacy → Data Request',
            'Response time: Within 30 days',
            'Verification: We may verify your identity first',
          ],
        },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking',
      icon: 'cafe-outline',
      color: '#ED64A6',
      content: [
        {
          subtitle: 'We Use Cookies For',
          details: [
            'Keeping you logged in',
            'Remembering your preferences',
            'Analyzing app performance',
            'Preventing security breaches',
          ],
        },
        {
          subtitle: 'Your Choices',
          details: [
            'Accept all cookies (recommended)',
            'Reject non-essential cookies',
            'Clear cookies from app settings',
            'Use incognito mode for private browsing',
          ],
        },
      ],
    },
    {
      id: 'children',
      title: 'Student Privacy',
      icon: 'school-outline',
      color: '#1E3A8A',
      content: [
        {
          subtitle: 'Protecting Student Data',
          details: [
            'We comply with FERPA regulations',
            'Student records are strictly confidential',
            'Parental consent required for users under 18',
            'Academic information never shared without permission',
            'Campus counselors have limited access for support',
          ],
        },
      ],
    },
    {
      id: 'international',
      title: 'International Data Transfers',
      icon: 'globe-outline',
      color: '#4299E1',
      content: [
        {
          subtitle: 'Data Storage',
          details: [
            'Servers located in Ghana',
            'Data may be processed internationally',
            'We ensure adequate protection for transfers',
            'Standard contractual clauses implemented',
          ],
        },
      ],
    },
    {
      id: 'updates',
      title: 'Policy Updates',
      icon: 'refresh-circle-outline',
      color: '#718096',
      content: [
        {
          subtitle: 'When We Update',
          details: [
            'Material changes: 30 days advance notice',
            'Minor updates: Posted in-app notification',
            'Continued use constitutes acceptance',
            'Previous versions available upon request',
          ],
        },
        {
          subtitle: 'Notification Methods',
          details: [
            'In-app popup for important changes',
            'Email notification for major updates',
            'Public announcement on platform',
            'Version history available in settings',
          ],
        },
      ],
    },
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleContactDPO = () => {
    Linking.openURL('mailto:dpo@uenrmarketplace.com');
  };

  const handleDataRequest = () => {
    Alert.alert(
      'Request Your Data',
      'Choose what you would like to do:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export My Data', onPress: () => exportUserData() },
        { text: 'Delete My Data', onPress: () => confirmDataDeletion() },
      ],
      { cancelable: true }
    );
  };

  const exportUserData = () => {
    Alert.alert(
      'Data Export Request',
      'We will prepare your data within 30 days. You will receive a download link via email.',
      [{ text: 'OK', onPress: () => handleContactDPO() }]
    );
  };

  const confirmDataDeletion = () => {
    Alert.alert(
      'Delete Your Data',
      'Are you sure? This action cannot be undone. Your account and all associated data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Request Received', 'We will process your deletion request within 30 days.');
          }
        },
      ]
    );
  };

  const handleReportPrivacyConcern = () => {
    Alert.alert(
      'Report Privacy Concern',
      'How would you like to report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email DPO', onPress: handleContactDPO },
        { text: 'Call Helpline', onPress: () => Linking.openURL('tel:0551234567') },
      ]
    );
  };

  return (
    <>
      <StatusBar style="light" backgroundColor="#00BFFF" />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.whiteBackground}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#1A365D" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Privacy Policy</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Last Updated & Effective Date */}
            <View style={styles.dateContainer}>
              <View style={styles.dateBadge}>
                <Ionicons name="calendar-outline" size={14} color="#718096" />
                <Text style={styles.dateText}>Effective: January 15, 2024</Text>
              </View>
              <View style={styles.dateBadge}>
                <Ionicons name="time-outline" size={14} color="#718096" />
                <Text style={styles.dateText}>Last Updated: February 1, 2024</Text>
              </View>
            </View>

            {/* Introduction */}
            <View style={styles.introContainer}>
              <Ionicons name="lock-closed" size={30} color="#00BFFF" style={styles.introIcon} />
              <Text style={styles.introTitle}>Your Privacy Matters</Text>
              <Text style={styles.introText}>
                At UENR Marketplace, we are committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your data 
                when you use our platform.
              </Text>
            </View>

            {/* Privacy Controls Card */}
            <View style={styles.controlsCard}>
              <Text style={styles.controlsTitle}>Your Privacy Controls</Text>
              <View style={styles.controlItem}>
                <View style={styles.controlInfo}>
                  <Ionicons name="analytics" size={20} color="#00BFFF" />
                  <Text style={styles.controlLabel}>Usage Analytics</Text>
                </View>
                <Switch
                  value={analyticsEnabled}
                  onValueChange={setAnalyticsEnabled}
                  trackColor={{ false: '#E2E8F0', true: '#00BFFF' }}
                  thumbColor={analyticsEnabled ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
              <View style={styles.controlItem}>
                <View style={styles.controlInfo}>
                  <Ionicons name="mail" size={20} color="#00BFFF" />
                  <Text style={styles.controlLabel}>Marketing Communications</Text>
                </View>
                <Switch
                  value={marketingEnabled}
                  onValueChange={setMarketingEnabled}
                  trackColor={{ false: '#E2E8F0', true: '#00BFFF' }}
                  thumbColor={marketingEnabled ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
              <TouchableOpacity style={styles.dataRequestButton} onPress={handleDataRequest}>
                <Ionicons name="download-outline" size={18} color="#00BFFF" />
                <Text style={styles.dataRequestButtonText}>Request My Data</Text>
              </TouchableOpacity>
            </View>

            {/* Privacy Sections */}
            {sections.map((section) => (
              <View key={section.id} style={styles.sectionContainer}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection(section.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.sectionTitleContainer}>
                    <Ionicons name={section.icon} size={24} color={section.color} />
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>
                  <Ionicons
                    name={expandedSection === section.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#718096"
                  />
                </TouchableOpacity>
                
                {expandedSection === section.id && (
                  <View style={styles.sectionContent}>
                    {section.content.map((subsection, idx) => (
                      <View key={idx} style={styles.subsectionContainer}>
                        <Text style={styles.subsectionTitle}>{subsection.subtitle}</Text>
                        {subsection.details.map((detail, detailIdx) => (
                          <View key={detailIdx} style={styles.detailItem}>
                            <View style={styles.bulletPoint}>
                              <Ionicons name="checkmark-circle" size={14} color="#00BFFF" />
                              <Text style={styles.detailText}>{detail}</Text>
                            </View>
                          </View>
                        ))}
                        {idx < section.content.length - 1 && <View style={styles.divider} />}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}

            {/* Your Rights Summary */}
            <View style={styles.rightsSummary}>
              <Ionicons name="shield-checkmark" size={28} color="#38A169" />
              <Text style={styles.rightsSummaryTitle}>Your Rights At A Glance</Text>
              <View style={styles.rightsGrid}>
                <View style={styles.rightItem}>
                  <Ionicons name="eye-outline" size={20} color="#38A169" />
                  <Text style={styles.rightText}>Access</Text>
                </View>
                <View style={styles.rightItem}>
                  <Ionicons name="create-outline" size={20} color="#38A169" />
                  <Text style={styles.rightText}>Rectify</Text>
                </View>
                <View style={styles.rightItem}>
                  <Ionicons name="trash-outline" size={20} color="#38A169" />
                  <Text style={styles.rightText}>Delete</Text>
                </View>
                <View style={styles.rightItem}>
                  <Ionicons name="download-outline" size={20} color="#38A169" />
                  <Text style={styles.rightText}>Export</Text>
                </View>
                <View style={styles.rightItem}>
                  <Ionicons name="close-circle-outline" size={20} color="#38A169" />
                  <Text style={styles.rightText}>Opt-out</Text>
                </View>
              </View>
            </View>

            {/* Compliance Badges */}
            <View style={styles.complianceContainer}>
              <Text style={styles.complianceTitle}>Compliance & Certifications</Text>
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Ionicons name="shield" size={20} color="#00BFFF" />
                  <Text style={styles.badgeText}>GDPR Compliant</Text>
                </View>
                <View style={styles.badge}>
                  <Ionicons name="business" size={20} color="#00BFFF" />
                  <Text style={styles.badgeText}>FERPA Compliant</Text>
                </View>
                <View style={styles.badge}>
                  <Ionicons name="cloud" size={20} color="#00BFFF" />
                  <Text style={styles.badgeText}>Data Protection Act</Text>
                </View>
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.contactContainer}>
              <Text style={styles.contactTitle}>Data Protection Officer (DPO)</Text>
              <TouchableOpacity style={styles.contactButton} onPress={handleContactDPO}>
                <Ionicons name="mail-outline" size={20} color="#00BFFF" />
                <Text style={styles.contactButtonText}>dpo@uenrmarketplace.com</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL('tel:0551234567')}>
                <Ionicons name="call-outline" size={20} color="#00BFFF" />
                <Text style={styles.contactButtonText}>055 123 4567</Text>
              </TouchableOpacity>
              <View style={styles.contactAddress}>
                <Ionicons name="location-outline" size={20} color="#718096" />
                <Text style={styles.addressText}>
                  UENR Campus, Sunyani, Ghana{'\n'}
                  Information Technology Services
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.reportButton} onPress={handleReportPrivacyConcern}>
                <Ionicons name="flag-outline" size={20} color="#FF3B30" />
                <Text style={styles.reportButtonText}>Report Privacy Concern</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.acceptButton} onPress={() => router.back()}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.acceptButtonText}>I Understand</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2026 UENR Marketplace. All rights reserved.
              </Text>
              <View style={styles.footerLinks}>
                <TouchableOpacity onPress={() => router.push('/terms')}>
                  <Text style={styles.footerLink}>Terms & Conditions</Text>
                </TouchableOpacity>
                <Text style={styles.footerDot}>•</Text>
                <TouchableOpacity onPress={() => router.push('/privacy')}>
                  <Text style={styles.footerLink}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  whiteBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A365D',
  },
  dateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#718096',
  },
  introContainer: {
    backgroundColor: 'rgba(0, 191, 255, 0.05)',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 191, 255, 0.2)',
  },
  introIcon: {
    marginBottom: 12,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A365D',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 20,
  },
  controlsCard: {
    backgroundColor: '#F8FAFC',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  controlsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A365D',
    marginBottom: 12,
  },
  controlItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  controlInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlLabel: {
    fontSize: 14,
    color: '#4A5568',
  },
  dataRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00BFFF',
  },
  dataRequestButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00BFFF',
  },
  sectionContainer: {
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A365D',
  },
  sectionContent: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subsectionContainer: {
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00BFFF',
    marginBottom: 8,
  },
  detailItem: {
    marginBottom: 6,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  rightsSummary: {
    backgroundColor: 'rgba(56, 161, 105, 0.1)',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 161, 105, 0.2)',
  },
  rightsSummaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2F855A',
    marginTop: 8,
    marginBottom: 12,
  },
  rightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  rightItem: {
    alignItems: 'center',
    gap: 4,
  },
  rightText: {
    fontSize: 12,
    color: '#38A169',
    fontWeight: '500',
  },
  complianceContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  complianceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A365D',
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeText: {
    fontSize: 12,
    color: '#00BFFF',
    fontWeight: '500',
  },
  contactContainer: {
    backgroundColor: '#F8FAFC',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A365D',
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  contactButtonText: {
    fontSize: 14,
    color: '#00BFFF',
    textDecorationLine: 'underline',
  },
  contactAddress: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: '#718096',
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  reportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  reportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00BFFF',
    paddingVertical: 12,
    borderRadius: 12,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLink: {
    fontSize: 12,
    color: '#00BFFF',
    textDecorationLine: 'underline',
  },
  footerDot: {
    fontSize: 12,
    color: '#718096',
  },
});