import React from 'react'
import axios from "axios";

import {useEffect } from "react";
const API_URL = process.env.REACT_APP_API_URL;
function Util() {
  const SendVersion =async ()=>{
          const vSANDBOX = document.getElementById("SANDBOX"); 
           const version = document.querySelector('input[name="verion"]:checked').value;   
            //const vProduction = document.getElementById("Production");
            //let version = (vSANDBOX.checked ? "SANDBOX" : "Production") ;
            console.log("verssion utiliser est  ",version);
            console.log("valeur de la verssion utiliser est  ",version);
          const data = {
            version:version
          }
          await axios.post(`${API_URL}/session`,{
           version:version
          })
          .then((response)=>{                       
               console.log("verssion retournée est  ",response);
          })
          .catch((error)=>{
            console.log("error lors de l'enrgistrment verssion ",error);
          })
          
        
    }
    // const GetVersion =async ()=>{      
    //       await axios.get(`${API_URL}/session`,)
    //       .then((response)=>{  
    //            const version =  response.version;
    //             document.querySelector('input[name="verion"]:checked').value = version;
    //       })
    //       .catch((error)=>{
    //         console.log("error lors de de larécupération de la verssion ",error);
    //       })
          
        
    // }
    useEffect(()=>{
        const fetchData = async()=>{
          await axios.get(`${API_URL}/session`,)
          .then((response)=>{  
               const version =  response.data;
               console.log("récupération de la verssion ok 1 ",version," réponse = ",response);
                document.getElementById(version).checked =true;
                //document.querySelector('input[name="verion"]:checked').value = version;
          })
          .catch((error)=>{
            console.log("error lors de de larécupération de la verssion ",error);
          })
          
        };
        fetchData()
      },[]);
      //defaultChecked="true"
  return (
    <div >
        <form>
          <div style={{width:"300px",margin:"auto"}}>
            <input type="radio" id="SANDBOX" name='verion'  onChange={SendVersion}  value="SANDBOX"/>
            <label htmlFor="SANDBOX"> Utiliser la version SandBox</label><br/>
            <input type="radio" name='verion' id="Production" onChange={SendVersion}   value="Production"/>
            <label htmlFor="Production"> Utiliser la version production</label>
          </div>
        </form>        
    </div>
  )
}

export default Util
