import Constants from 'expo-constants';
import React, { useLayoutEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native'
import RenderPara from '../../components/RenderPara'

const PrivacyPolicy = ({navigation}) => {

    useLayoutEffect(() =>{
        navigation.setOptions({
            headerTitle: "Privacy Policy",
            headerTitleAlign: "center"
        })
    },[navigation])

    return (
        <ScrollView style={{flex:1,backgroundColor: "white"}}>
            <View style={styles.container}>

            {/* <Text style={{alignSelf: "center", marginVertical: 10, fontSize: 24, fontWeight: "bold"}}>Privacy Policy</Text> */}
            <RenderPara 
                heading="WHEN DO WE COLLECT INFORMATION?"            
                text="We collect all necessary information from you when you register on our site, or when you make changes to your details within your personal account panel." 
            />
            <View style={styles.textContainer}>
                <Text style={styles.heading}>HOW DO WE USE YOUR INFORMATION?</Text>
                <Text style={styles.text}>We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:</Text>
                <Text style={styles.text}>1. To quickly process your transactions.</Text>
                <Text style={styles.text}>2. To send periodic emails regarding your order or other products and services.</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.heading}>HOW DO WE PROTECT VISITOR INFORMATION?</Text>
                <Text style={styles.text}>Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make your visit to our site as safe as possible.</Text>
                <Text style={styles.text}>We use regular Malware Scanning.</Text>
                <Text style={styles.text}>Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.</Text>
                <Text style={styles.text}>We implement a variety of security measures when a user places an order enters, submits, or accesses their information to maintain the safety of your personal information.</Text>
                <Text style={styles.text}>All transactions are processed through a gateway provider and are not stored or processed on our servers.</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.heading}>DO WE USE ‘COOKIES’?</Text>
                <Text style={styles.text}>We do not use cookies for tracking purposes</Text>
                <Text style={styles.text}>You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser (like Internet Explorer) settings. Each browser is a little different, so look at your browser’s Help menu to learn the correct way to modify your cookies.</Text>
                <Text style={styles.text}>If you disable cookies off, some features will be disabled that make your site experience more efficient and some of our services will not function properly.</Text>
            </View>
            <RenderPara 
                heading="GOOGLE" 
                text="We along with third-party vendors, such as Google use first-party cookies (such as the Google Analytics cookies) to measure site traffic.

                Opting out:
                
                Users can set preferences for how Google advertises to you using the Google Ad Settings page. Alternatively, you can opt out by visiting the Network Advertising initiative opt out page or permanently using the Google Analytics Opt Out Browser add on." 
            />
            <RenderPara 
                heading="HOW DOES OUR SITE HANDLE DO NOT TRACK SIGNALS?" 
                text="We honor do not track signals and do not track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place." 
            />
            <RenderPara 
                heading="DOES OUR SITE ALLOW THIRD-PARTY BEHAVIORAL TRACKING?" 
                text="It’s also important to note that we do not allow third-party behavioural tracking" 
            />
            <RenderPara 
                heading="COPPA (CHILDREN ONLINE PRIVACY PROTECTION ACT)" 
                text="When it comes to the collection of personal information from children under 13, the Children’s Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, the nation’s consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children’s privacy and safety online.

                We do not specifically market to children under 13." 
            />
            <RenderPara 
                heading="WE COLLECT YOUR EMAIL ADDRESS IN ORDER TO:" 
                text=" 1. Send information, respond to inquiries, and/or other requests or questions.
                2. Market to our mailing list or continue to send emails to our clients after the original transaction has occurred." 
            />
            <RenderPara 
                heading="PRIVACY POLICY UPDATES" 
                text="We reserve the right to modify this privacy policy at any time. If we make changes to this policy we may or may not notify you, therefore you should review this privacy policy frequently." 
            />
            <RenderPara 
                heading="CONTACTING US" 
                text="If there are any questions regarding this privacy policy, you may contact us by emailing:

                Socially. team@gmail.com" 
            />
            </View>
           
        </ScrollView>
    )
}

export default PrivacyPolicy

const styles = StyleSheet.create({
    textContainer:{
        flexDirection: "column",
        alignItems:"center",
        margin: 10
    },
    heading:{
        fontSize: 18,
        fontWeight:"bold"
    },
    text:{
        fontSize: 15,
        alignSelf:"flex-start"
    },
    container:{
        flex:1,
        flexDirection: "column",
        margin: 10,
        marginTop: 25,
       
        // alignItems:"center"
    }
})
