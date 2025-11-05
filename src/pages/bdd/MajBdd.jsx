import axios from "axios";
import toast from 'react-hot-toast';
import querystring from 'querystring';
import * as apiController from "../components/apiController.js";
function MajBdd() {
  const majBASEDD = async(e)=>{
    const tagSubmit =  document.getElementById("tagSubmit");
           tagSubmit.style.display="none";

  const tagEnvoie =  document.getElementById("tagEnvoie");
           tagEnvoie.style.display="block";
       // e.preventDefault();
        await axios.get("http://localhost:8800/api/majbdd")
        .then((response)=>{
          
         // toast.success(response.data.message,{position:"top-right"});
            console.log("Mise à jour de la base de données terminée");
            tagEnvoie.style.display="none";
            toast.success("Mise à jour de la base de données terminée.",{position:"top-right"});
            tagSubmit.style.display="block";
            // const tagmsg =  document.getElementById("tagMessage");
            //  tagmsg.style.display="block";
            // tagmsg.innerText ="Mise à jour de la base de données terminée";
            //tagmsg.style.display="none";
           
        })
        .catch((error)=>{
           tagSubmit.style.display="block";
          tagEnvoie.style.display="none";
          const tagmsg =  document.getElementById("tagMessage");
           tagmsg.style.display="block";
           tagmsg.innerText =error.message;
        })
    }
    
  return (
    <div>
        
        <button id="tagSubmit" type="button" onClick={majBASEDD}  className="btn btn-primary">Démarrer la mise à jour de la base de données</button>
        <div id="tagEnvoie" style={{margin:"20px", padding:"3px",display:"none"}}>
            <section class="btn btn-primary" type="button" disabled>
               {/* <span class="spinner-grow spinner-grow-sm"  style={{ height:"50px", width:"50px", textAlign:"center"}} role="status" aria-hidden="true"> */}
                        Mise à jour de la base en cours…
                {/* </span>  */}
               
             </section> 
        </div>             
        <p id="tagMessage" style={{margin:"5px", border:"solid 2px red", padding:"3px",display:"none"}}>Merci pour votre message. Il a été envoyé</p>
               
    </div>
  )
}

export default MajBdd
