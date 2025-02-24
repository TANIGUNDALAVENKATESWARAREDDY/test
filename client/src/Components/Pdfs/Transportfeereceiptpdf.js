import React from "react";
import { Document, Page, PDFViewer, StyleSheet, Text, View ,Image} from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import OpenSansBold from "../../Assets/open-sans/OpenSans-ExtraBold.ttf";
import OpenSansRegular from "../../Assets/open-sans/OpenSans-Regular.ttf";
import OpenSansSemibold from "../../Assets/open-sans/OpenSans-Semibold.ttf";
import numWords from 'num-words';

import Vislogo from '../../Assets/vislogo.png';

const Transportfeereceiptpdf = (props) =>{
    const {storeTransportfeeReceipt , classSections , allTownsAndVillages} = props;
    Font.register({
        family: "OpenSans",
        fonts: [
        {
            src: OpenSansRegular,
            fontWeight: 400,
        },
        {
            src:OpenSansSemibold,
            fontWeight:600,
        },
        {
            src: OpenSansBold,
            fontWeight: 700,
        },
        
        ]
    });
    function handelFindSection(secid){
        const section = classSections.find(item=>item._id===secid);
        return section?`${section.sectionname}`:'section';
    }

    function handleFindVillageName(villageid){
        const village = allTownsAndVillages.find(item=>item.townid===villageid);
        return village?`${village.townname}`:'town';
    }

    function handlemodifyDate(tempdate){
        const date = new Date(tempdate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    return(
        <PDFViewer style={styles.container}>
            <Document>
                <Page size='A4' style={styles.page}>
                    <View>
                        {/* header */}
                        <View style={styles.topheader}>
                            <Text style={styles.receiptname}>Transport Fee Receipt</Text>
                            <Text style={styles.headercopyrole}>Student Copy</Text>
                        </View>
                        {/* top logo and school name container*/}
                        <View style={styles.schoollogocon}>
                            <Image src={Vislogo} style={styles.schoollogo}/>
                            <View style={styles.schoolnamecon}>
                                <Text style={styles.schoolname}>vivekananda international school</Text>
                                <Text style={styles.schoolnametext1}>9613138888</Text>
                                <Text style={styles.schoolnametext2}>urella road, chevella</Text>
                            </View>
                        </View>
                        {/* student details */}
                        <View style={styles.studentdetails}>
                            <View style={styles.studentdetailsbox1}>
                                <Text style={{...styles.schoolnametext2,fontSize:10}}>student Details</Text>
                                <Text style={styles.studentname}>{storeTransportfeeReceipt.stdname}</Text>
                                <View style={styles.studentdetailsrow}>
                                    <Text style={{...styles.schoolnametext2,fontSize:10}}>{storeTransportfeeReceipt.stdgender},</Text>
                                    <Text style={{...styles.schoolnametext2,fontSize:10}}>{storeTransportfeeReceipt.stdclass} - {handelFindSection(storeTransportfeeReceipt.stdsectionid)}</Text>
                                </View>
                                <View style={styles.studentdetailsrow}>
                                    <Text style={{...styles.schoolnametext2,fontSize:10}}>+91-{storeTransportfeeReceipt.stdmobile},</Text>
                                    <Text style={{...styles.schoolnametext2,fontSize:10}}>Enroll No: {storeTransportfeeReceipt.stdregid} ,</Text>
                                    <Text style={styles.studentname}>{handleFindVillageName(storeTransportfeeReceipt.stdtransportfrom)}</Text>
                                </View>
                            </View>
                            <View style={styles.studentdetailsbox2}>
                                <Text style={{...styles.schoolnametext2,fontSize:10}}>Parent Details</Text>
                                <Text style={styles.studentname}>{storeTransportfeeReceipt.paidby}</Text>
                            </View>
                        </View>
                        {/* payment details */}
                        <View style={styles.paymentdetailscon}>
                            <Text style={{...styles.schoolnametext2,fontSize:10}}>payment details</Text>
                            <View style={styles.paymentdetails}>
                                <View style={styles.paymentdetailsrow1}>
                                    <Text style={styles.paymentdetailsrowtextbold}>{storeTransportfeeReceipt.receiptnumber}</Text>
                                    <Text style={styles.paymentdetailsrowtext}>Receipt no:</Text>
                                </View>
                                <View style={styles.paymentdetailsrow1}>
                                    <Text style={styles.paymentdetailsrowtextbold}>{handlemodifyDate(storeTransportfeeReceipt.transportfeepaiddata)}</Text>
                                    <Text style={styles.paymentdetailsrowtext}>Date:</Text>
                                </View>
                            </View>
                            <View style={{...styles.studentdetails,borderBottom:'none',paddingLeft:0,paddingRight:0}}>
                                {
                                    storeTransportfeeReceipt.modedata.map((item,idx)=>(
                                        <View key={idx}  style={{...styles.studentdetailsbox1,borderLeft:2,borderColor:'#e0e0e0',paddingLeft:5,gap:0}}>
                                            <Text style={styles.studentname}>INR {item.modeamount} /-</Text>
                                            <Text style={{...styles.schoolnametext2,fontSize:9}}>{item.modetype}</Text>
                                        </View>
                                    ))
                                }
                                
                                <View style={{...styles.studentdetailsbox1,borderLeft:2,borderColor:'#e0e0e0',paddingLeft:5,gap:0}}>
                                    <Text style={styles.studentname}>INR {storeTransportfeeReceipt.totaltransportfee-storeTransportfeeReceipt.totalpaid-storeTransportfeeReceipt.stdamountpaidnow} /-</Text>
                                    <Text style={{...styles.schoolnametext2,fontSize:9}}>current Due</Text>
                                </View>
                            </View>
                        </View>

                        {/* paid amount */}
                        <View style={styles.studentdetails}>
                            <View style={styles.studentdetailsbox1}>
                                <Text style={{...styles.schoolnametext2,fontSize:10}}>Paid Amount</Text>
                            </View>
                            <View style={{...styles.studentdetailsbox2,gap:2}}>
                                <Text style={styles.studentname}>INR {storeTransportfeeReceipt.stdamountpaidnow} /-</Text>
                                <Text style={{...styles.schoolnametext2,fontSize:9}}>({numWords(storeTransportfeeReceipt.stdamountpaidnow)} Rupees Only)</Text>
                            </View>
                        </View>

                        {/* overview */}
                        <Text style={{...styles.schoolnametext2,fontSize:10,paddingLeft:10}}>overview</Text>
                        <View style={{...styles.studentdetails,borderBottom:'none'}}>
                            <View style={{...styles.studentdetailsbox1,borderLeft:2,borderColor:'#e0e0e0',paddingLeft:5,gap:0}}>
                                <Text style={styles.studentname}>INR {storeTransportfeeReceipt.totaltransportfee} /-</Text>
                                <Text style={{...styles.schoolnametext2,fontSize:9}}>Transport Fee Applied</Text>
                            </View>
                            <View style={{...styles.studentdetailsbox1,borderLeft:2,borderColor:'#e0e0e0',paddingLeft:5,gap:0}}>
                                <Text style={styles.studentname}>INR {storeTransportfeeReceipt.totalpaid+storeTransportfeeReceipt.stdamountpaidnow} /-</Text>
                                <Text style={{...styles.schoolnametext2,fontSize:9}}>Total Transport Fee Paid</Text>
                            </View>
                            <View style={{...styles.studentdetailsbox1,borderLeft:2,borderColor:'#e0e0e0',paddingLeft:5,gap:0}}>
                                <Text style={styles.studentname}>INR {storeTransportfeeReceipt.totaltransportfee-storeTransportfeeReceipt.totalpaid-storeTransportfeeReceipt.stdamountpaidnow} /-</Text>
                                <Text style={{...styles.schoolnametext2,fontSize:9}}>Total Transport Fee Due</Text>
                            </View>
                        </View>

                        <View style={{display:'flex',flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}>
                            <Text style={styles.paymentdetailsrowtext}>next date: <Text style={styles.paymentdetailsrowtextbold}>{handlemodifyDate(storeTransportfeeReceipt.transportnextfeedate)}</Text></Text>
                        </View>
                        {/* fee collected */}
                        <View style={styles.feecollected}>
                            <Text style={styles.feecollectedtext}>Transport fee collected by</Text>
                            <Text style={{...styles.feecollectedtext,fontWeight:600}}>staff</Text>
                            <Text style={styles.feecollectedtext}>this is a computer generated receipt and does not need to signature</Text>
                        </View>
                        {/*school receipt  header */}
                        <View style={{border:1,borderStyle:'dotted',marginTop:10,marginBottom:10}}></View>
                        {/* school header */}
                        <View style={styles.topheader}>
                            <Text style={styles.receiptname}>Transport Fee Receipt</Text>
                            <Text style={styles.headercopyrole}>School Copy</Text>
                        </View>
                        {/* top logo and school name container*/}
                        <View style={styles.schoollogocon}>
                            <Image src={Vislogo} style={styles.schoollogo}/>
                            <View style={styles.schoolnamecon}>
                                <Text style={styles.schoolname}>vivekananda international school</Text>
                                <Text style={styles.schoolnametext1}>9613138888</Text>
                                <Text style={styles.schoolnametext2}>urella road, chevella</Text>
                            </View>
                        </View>
                        {/* student details */}
                        <View style={styles.studentdetails}>
                            <View style={styles.studentdetailsbox1}>
                                <Text style={{...styles.schoolnametext2,fontSize:10}}>student Details</Text>
                                <Text style={styles.studentname}>{storeTransportfeeReceipt.stdname}</Text>
                                <View style={styles.studentdetailsrow}>
                                    <Text style={{...styles.schoolnametext2,fontSize:10}}>{storeTransportfeeReceipt.stdgender},</Text>
                                    <Text style={{...styles.schoolnametext2,fontSize:10}}>{storeTransportfeeReceipt.stdclass} - {handelFindSection(storeTransportfeeReceipt.stdsectionid)}</Text>
                                </View>
                                <View style={styles.studentdetailsrow}>
                                    <Text style={{...styles.schoolnametext2,fontSize:10}}>+91-{storeTransportfeeReceipt.stdmobile},</Text>
                                    <Text style={{...styles.schoolnametext2,fontSize:10}}>Enroll No: {storeTransportfeeReceipt.stdregid} ,</Text>
                                    <Text style={styles.studentname}>{handleFindVillageName(storeTransportfeeReceipt.stdtransportfrom)}</Text>
                                </View>
                            </View>
                            <View style={styles.studentdetailsbox2}>
                                <Text style={{...styles.schoolnametext2,fontSize:10}}>Parent Details</Text>
                                <Text style={styles.studentname}>{storeTransportfeeReceipt.paidby}</Text>
                            </View>
                        </View>
                        {/* payment details */}
                        <View style={styles.paymentdetailscon}>
                            <Text style={{...styles.schoolnametext2,fontSize:10}}>payment details</Text>
                            <View style={styles.paymentdetails}>
                                <View style={styles.paymentdetailsrow1}>
                                    <Text style={styles.paymentdetailsrowtextbold}>{storeTransportfeeReceipt.receiptnumber}</Text>
                                    <Text style={styles.paymentdetailsrowtext}>Receipt no:</Text>
                                </View>
                                <View style={styles.paymentdetailsrow1}>
                                    <Text style={styles.paymentdetailsrowtextbold}>{handlemodifyDate(storeTransportfeeReceipt.transportfeepaiddata)}</Text>
                                    <Text style={styles.paymentdetailsrowtext}>Date:</Text>
                                </View>
                            </View>
                            <View style={{...styles.studentdetails,borderBottom:'none',paddingLeft:0,paddingRight:0}}>
                                {
                                    storeTransportfeeReceipt.modedata.map((item,idx)=>(
                                        <View key={idx}  style={{...styles.studentdetailsbox1,borderLeft:2,borderColor:'#e0e0e0',paddingLeft:5,gap:0}}>
                                            <Text style={styles.studentname}>INR {item.modeamount} /-</Text>
                                            <Text style={{...styles.schoolnametext2,fontSize:9}}>{item.modetype}</Text>
                                        </View>
                                    ))
                                }
                                
                                <View style={{...styles.studentdetailsbox1,borderLeft:2,borderColor:'#e0e0e0',paddingLeft:5,gap:0}}>
                                    <Text style={styles.studentname}>INR {storeTransportfeeReceipt.totaltransportfee-storeTransportfeeReceipt.totalpaid-storeTransportfeeReceipt.stdamountpaidnow} /-</Text>
                                    <Text style={{...styles.schoolnametext2,fontSize:9}}>current Due</Text>
                                </View>
                            </View>
                        </View>

                        {/* paid amount */}
                        <View style={styles.studentdetails}>
                            <View style={styles.studentdetailsbox1}>
                                <Text style={{...styles.schoolnametext2,fontSize:10}}>Paid Amount</Text>
                            </View>
                            <View style={{...styles.studentdetailsbox2,gap:2}}>
                                <Text style={styles.studentname}>INR {storeTransportfeeReceipt.stdamountpaidnow} /-</Text>
                                <Text style={{...styles.schoolnametext2,fontSize:9}}>({numWords(storeTransportfeeReceipt.stdamountpaidnow)} Rupees Only)</Text>
                            </View>
                        </View>

                        {/* overview */}
                        <Text style={{...styles.schoolnametext2,fontSize:10,paddingLeft:10}}>overview</Text>
                        <View style={{...styles.studentdetails,borderBottom:'none'}}>
                            <View style={{...styles.studentdetailsbox1,borderLeft:2,borderColor:'#e0e0e0',paddingLeft:5,gap:0}}>
                                <Text style={styles.studentname}>INR {storeTransportfeeReceipt.totaltransportfee} /-</Text>
                                <Text style={{...styles.schoolnametext2,fontSize:9}}>Transport Fee Applied</Text>
                            </View>
                            <View style={{...styles.studentdetailsbox1,borderLeft:2,borderColor:'#e0e0e0',paddingLeft:5,gap:0}}>
                                <Text style={styles.studentname}>INR {storeTransportfeeReceipt.totalpaid+storeTransportfeeReceipt.stdamountpaidnow} /-</Text>
                                <Text style={{...styles.schoolnametext2,fontSize:9}}>Total Transport Fee Paid</Text>
                            </View>
                            <View style={{...styles.studentdetailsbox1,borderLeft:2,borderColor:'#e0e0e0',paddingLeft:5,gap:0}}>
                                <Text style={styles.studentname}>INR {storeTransportfeeReceipt.totaltransportfee-storeTransportfeeReceipt.totalpaid-storeTransportfeeReceipt.stdamountpaidnow} /-</Text>
                                <Text style={{...styles.schoolnametext2,fontSize:9}}>Total Transport Fee Due</Text>
                            </View>
                        </View>

                        <View style={{display:'flex',flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}>
                            <Text style={styles.paymentdetailsrowtext}>next date: <Text style={styles.paymentdetailsrowtextbold}>{handlemodifyDate(storeTransportfeeReceipt.transportnextfeedate)}</Text></Text>
                        </View>
                        {/* fee collected */}
                        <View style={styles.feecollected}>
                            <Text style={styles.feecollectedtext}>Transport fee collected by</Text>
                            <Text style={{...styles.feecollectedtext,fontWeight:600}}>staff</Text>
                            <Text style={styles.feecollectedtext}>this is a computer generated receipt and does not need to signature</Text>
                        </View>
                    </View>

                </Page>
            </Document>
        </PDFViewer>
    );
}

export default Transportfeereceiptpdf;
export const styles = StyleSheet.create({
    paymentdetailsrowtext:{
        fontSize:9,
        fontFamily:'OpenSans',
        fontWeight:400
    },
    paymentdetailsrowtextbold:{
        fontSize:9,
        fontFamily:'OpenSans',
        fontWeight:600
    },
    paymentdetailsrow1:{
        display:'flex',
        flexDirection:'row-reverse',
        alignItems:'center',
        gap:3
    },
    paymentdetails:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    paymentdetailscon:{
        paddingLeft:10,
        display:'flex',
        flexDirection:'column',
        gap:3,
        borderBottom:1,
        paddingTop:3,
        paddingBottom:3,
        borderColor:'#e0e0e0'
    },
    feecollectedtext:{
        fontSize:10,
        fontFamily:'OpenSans',
        fontWeight:400,
        textTransform:'capitalize'
        },
    feecollected:{
        display:'flex',
        flexDirection:'column',
        gap:1,
        marginTop:5,
    },
    studentname:{
        textTransform:'uppercase',
        fontFamily:'OpenSans',
        fontWeight:600,
        fontSize:10,
    },
    studentdetailsrow:{
        display:'flex',
        flexDirection:'row',
        gap:5,
        alignItems:'center'
    },
    studentdetailsbox2:{
        flex:1,
        alignItems:'center',
        gap:4,
    },
    studentdetailsbox1:{
        // backgroundColor:'red',
        display:'flex',
        flexDirection:'column',
        gap:4,
        flex:1
    },
    studentdetails:{
        display:'flex',
        flexDirection:'row',
        borderBottom:1,
        borderColor:'#e0e0e0',
        padding:10,
        paddingBottom:5,
        paddingTop:5
    },
    schoolnametext2:{
        fontFamily:'OpenSans',
        fontWeight:400,
        fontSize:11,
        textTransform:'capitalize',
        
    },
    schoolnametext1:{
        fontFamily:'OpenSans',
        fontWeight:400,
        fontSize:10,
        textTransform:'capitalize',
        marginTop:0
    },
    schoolname:{
        fontSize:11,
        fontFamily:'OpenSans',
        textTransform:'capitalize',
        fontWeight:600
    },
    schoolnamecon:{
        display:'flex',
        flexDirection:'column',
        gap:2
    },
    schoollogo:{
        width:50,
        height:50
    },
    schoollogocon:{
        display:'flex',
        flexDirection:'row',
        padding:10,
        gap:20,
        backgroundColor:'#fafafa'
    },
    receiptname:{
        fontSize:11,
        textTransform:'capitalize',
        fontWeight:'600',
        fontFamily:'OpenSans',
    },
    headercopyrole:{
        fontSize:10,
        textTransform:'uppercase',
        fontFamily:'OpenSans',
        fontWeight:600,
    },
    topheader:{
        display:'felx',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:10,
        paddingVertical:3,
        backgroundColor:'#e0e0e0'
    },
    page:{
        padding:15,
        width:'100%',
        height:'100vh',
        backgroundColor:'white'
    },
    container:{
        width:'100%',
        height:'100vh'
    }
});
