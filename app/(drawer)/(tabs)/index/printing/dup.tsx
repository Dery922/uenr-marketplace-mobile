import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function RedesignedPrintingScreen() {
  const [step, setStep] = useState(1); // 1: Select Press, 2: Upload/Config, 3: Ticket
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [colorMode, setColorMode] = useState('bw');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticket, setTicket] = useState(null);

  // --- LOGIC ---
const pickDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    });

    if (result.type === 'success') {
      // If it's a Word file, trigger the conversion flow
      if (result.name.endsWith('.docx') || result.name.endsWith('.doc')) {
        handleWordToPdfConversion(result);
      } else {
        setDocuments([...documents, result]);
      }
    }
  } catch (error) {
    console.error("Picker error:", error);
  }
};


  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API Call to Payment Gateway
    setTimeout(() => {
      setIsProcessing(false);
      setTicket({ id: 'PRT-9921', code: 'X92B1' });
      setStep(3);
    }, 2000);
  };

  // --- SUB-COMPONENTS ---
  const SectionTitle = ({ title, subtitle }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
 <View style={styles.header}>
  <View style={styles.headerLeft}>
    {step > 1 && step < 3 && (
      <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
      </TouchableOpacity>
    )}
    <Text style={styles.headerTitle}>Campus Print</Text>
  </View>
  
  <View style={styles.stepIndicator}>
    {[1, 2, 3].map((i) => (
      <TouchableOpacity 
        key={i} 
        disabled={step === 3} // Prevent jumping after payment
        onPress={() => i < step && setStep(i)}
      >
        <View style={[styles.stepDot, step >= i && styles.stepDotActive]} />
      </TouchableOpacity>
    ))}
  </View>
</View>


      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 1 && (
          <>
            <SectionTitle title="Select a Press" subtitle="Find the nearest available printer" />
            {PRINTERS.map(printer => (
              <TouchableOpacity 
                key={printer.id} 
                style={[styles.printerCard, selectedPrinter?.id === printer.id && styles.selectedCard]}
                onPress={() => setSelectedPrinter(printer)}
              >
                <Image source={{ uri: printer.image }} style={styles.printerImg} />
                <View style={styles.printerInfo}>
                  <Text style={styles.printerName}>{printer.name}</Text>
                  <Text style={styles.printerLoc}><Ionicons name="location" size={12}/> {printer.location}</Text>
                  <View style={styles.tagRow}>
                    <View style={styles.tag}><Text style={styles.tagText}>₵{printer.price}/pg</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>{printer.distance}</Text></View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <SectionTitle title="Configure Job" subtitle="Upload PDF and choose settings" />
            
            <TouchableOpacity style={styles.uploadBtn} onPress={pickDocument}>
              <Ionicons name="cloud-upload-outline" size={30} color="#00BFFF" />
              <Text style={styles.uploadBtnText}>Upload PDF Document</Text>
            </TouchableOpacity>

            {documents.map((doc, idx) => (
              <View key={idx} style={styles.docItem}>
                <Ionicons name="document" size={20} color="#667" />
                <Text style={styles.docName} numberOfLines={1}>{doc.name}</Text>
                <TouchableOpacity onPress={() => setDocuments([])}>
                   <Ionicons name="close-circle" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.configBox}>
               <Text style={styles.label}>Color Mode</Text>
               <View style={styles.toggleRow}>
                  <TouchableOpacity 
                    style={[styles.toggleBtn, colorMode === 'bw' && styles.toggleActive]} 
                    onPress={() => setColorMode('bw')}
                  ><Text>B&W</Text></TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.toggleBtn, colorMode === 'color' && styles.toggleActive]} 
                    onPress={() => setColorMode('color')}
                  ><Text>Color</Text></TouchableOpacity>
               </View>
            </View>
          </>
        )}

        {step === 3 && ticket && (
           <View style={styles.ticketCard}>
              <LinearGradient colors={['#00BFFF', '#007FFF']} style={styles.ticketHeader}>
                <Text style={styles.ticketHeaderText}>PICKUP TICKET</Text>
                <Text style={styles.ticketId}>{ticket.id}</Text>
              </LinearGradient>
              <View style={styles.ticketBody}>
                 <Text style={styles.qrPlaceholder}>[ QR CODE ]</Text>
                 <Text style={styles.ticketInstructions}>Show this to the attendant at {selectedPrinter.name}</Text>
                 <TouchableOpacity style={styles.resetBtn} onPress={() => setStep(1)}>
                    <Text style={styles.resetBtnText}>Make New Order</Text>
                 </TouchableOpacity>
              </View>
           </View>
        )}
      </ScrollView>

      {/* Persistent Footer Action */}
      {step < 3 && (
        <View style={styles.footer}>
          {step === 2 && <Text style={styles.totalText}>Total: ₵15.00</Text>}
          <TouchableOpacity 
            style={[styles.mainBtn, (!selectedPrinter || (step === 2 && documents.length === 0)) && styles.disabledBtn]} 
            onPress={() => step === 1 ? setStep(2) : handlePayment()}
            disabled={!selectedPrinter || (step === 2 && documents.length === 0)}
          >
            {isProcessing ? <ActivityIndicator color="#fff" /> : (
              <Text style={styles.mainBtnText}>{step === 1 ? 'Configure Print' : 'Pay via Mobile Money'}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const PRINTERS = [
  { id: '1', name: 'Campus Print Hub', location: 'Main Library', price: '0.50', distance: '200m', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df' },
  { id: '2', name: 'QuickPrint', location: 'Science Block', price: '0.40', distance: '500m', image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e' },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  stepIndicator: { flexDirection: 'row', gap: 6 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DDD' },
  stepDotActive: { backgroundColor: '#00BFFF', width: 20 },
  scrollContent: { padding: 20 },
  sectionHeader: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  sectionSubtitle: { color: '#666', marginTop: 4 },
  printerCard: { backgroundColor: '#FFF', borderRadius: 16, flexDirection: 'row', padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  selectedCard: { borderColor: '#00BFFF', backgroundColor: '#F0FBFF' },
  printerImg: { width: 80, height: 80, borderRadius: 12 },
  printerInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  printerName: { fontSize: 16, fontWeight: '600' },
  printerLoc: { fontSize: 13, color: '#666', marginVertical: 4 },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: { backgroundColor: '#F0F0F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, fontWeight: '600', color: '#444' },
  uploadBtn: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#00BFFF', borderRadius: 16, padding: 30, alignItems: 'center', backgroundColor: '#F0FBFF', marginBottom: 20 },
  uploadBtnText: { marginTop: 10, color: '#00BFFF', fontWeight: '600' },
  docItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 10, marginBottom: 10 },
  docName: { flex: 1, marginLeft: 10, fontSize: 14 },
  configBox: { marginTop: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#EEE', alignItems: 'center' },
  toggleActive: { backgroundColor: '#00BFFF' },
  footer: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE', flexDirection: 'row', alignItems: 'center' },
  totalText: { flex: 1, fontSize: 18, fontWeight: '700' },
  mainBtn: { flex: 2, backgroundColor: '#00BFFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  disabledBtn: { backgroundColor: '#CCC' },
  mainBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  ticketCard: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', elevation: 5 },
  ticketHeader: { padding: 30, alignItems: 'center' },
  ticketHeaderText: { color: '#FFF', opacity: 0.8, fontWeight: '600' },
  ticketId: { color: '#FFF', fontSize: 32, fontWeight: '900', marginTop: 5 },
  ticketBody: { padding: 30, alignItems: 'center' },
  qrPlaceholder: { fontSize: 12, color: '#999', marginVertical: 30, padding: 40, backgroundColor: '#F8F9FA' },
  ticketInstructions: { textAlign: 'center', color: '#666', marginBottom: 30 },
  resetBtn: { padding: 15 },
  resetBtnText: { color: '#00BFFF', fontWeight: '700' }
});
