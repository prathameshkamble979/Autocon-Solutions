import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 40,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#2563eb', // blue-600
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'column',
    },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 4,
    },
    brandColor: {
        color: '#2563eb',
    },
    headerRight: {
        fontSize: 10,
        color: '#64748b',
        textAlign: 'right',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b', // slate-800
        marginTop: 10,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#64748b', // slate-500
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    mainImage: {
        width: '100%',
        height: 250,
        objectFit: 'cover',
        borderRadius: 8,
        marginBottom: 30,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 10,
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 5,
    },
    text: {
        fontSize: 10,
        color: '#334155', // slate-700
        lineHeight: 1.6,
        marginBottom: 5,
        textAlign: 'justify',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingVertical: 6,
    },
    colLabel: {
        width: '35%',
        fontSize: 10,
        fontWeight: 'bold',
        color: '#475569',
    },
    colValue: {
        width: '65%',
        fontSize: 10,
        color: '#334155',
    },
    bulletPoint: {
        fontSize: 10,
        color: '#334155',
        lineHeight: 1.6,
        marginBottom: 4,
        paddingLeft: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 8,
        color: '#94a3b8',
    },
    contactInfo: {
        fontSize: 9,
        color: '#64748b',
        fontWeight: 'bold',
    }
});

const ProductBrochure = ({ product, tenant }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.companyName}>{tenant?.name?.split(' ')[0]} <Text style={styles.brandColor}>{tenant?.name?.split(' ').slice(1).join(' ')}</Text></Text>
                    <Text style={{ fontSize: 9, color: '#64748b' }}>Industrial Automation Excellence</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text>Technical Data Sheet</Text>
                    <Text>{new Date().toLocaleDateString()}</Text>
                </View>
            </View>

            {/* Product Title */}
            <View>
                <Text style={styles.title}>{product.name}</Text>
                <Text style={styles.subtitle}>{product.category} Series</Text>
            </View>

            {/* Main Image */}
            {product.image && (
                <Image style={styles.mainImage} src={product.image} />
            )}

            {/* Description */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Product Overview</Text>
                <Text style={styles.text}>{product.shortDesc}</Text>
            </View>

            {/* Specifications Table */}
            {product.specifications && product.specifications.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Technical Specifications</Text>
                    {product.specifications.map((spec, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.colLabel}>{spec.label}</Text>
                            <Text style={styles.colValue}>{spec.value}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Features List */}
            {product.features && product.features.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Key Features</Text>
                    {product.features.map((feature, index) => (
                        <Text key={index} style={styles.bulletPoint}>•  {feature}</Text>
                    ))}
                </View>
            )}

            {/* Applications List */}
            {product.useCases && product.useCases.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Applications</Text>
                    {product.useCases.map((useCase, index) => (
                        <Text key={index} style={styles.bulletPoint}>•  {useCase}</Text>
                    ))}
                </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
                <View>
                    <Text style={styles.contactInfo}>{tenant?.contactInfo?.phone} | {tenant?.contactInfo?.email}</Text>
                    <Text style={styles.footerText}>{tenant?.contactInfo?.address}</Text>
                </View>
                <Text style={styles.footerText}>{tenant?.domains?.[0] || 'www.company.com'}</Text>
            </View>

        </Page>
    </Document>
);

export default ProductBrochure;
