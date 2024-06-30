import {SERVER_IP} from "@env";

async function checkInfo(email, password, url){
    try{
        const submitData = {
            email:email,
            password:password
        }
        console.log(SERVER_IP);
        
        const res = await (await fetch(`http://${SERVER_IP}:3000/${url}/`, {
            method:'POST',
            headers:{
                "Content-Type":'application/json'
            },
            body:JSON.stringify(submitData)
        })).json();

        // console.log(res);
        // console.log(res);
        //로그인 성공
        if(res.message === 'success'){
            
            return {result:'success', role:res.role, id:res.id};
        }
        //실패
        else if(res.message === 'fail'){
            return {result:'fail'};
        }
        //오류
        else{
            console.error(res);
            return {result:'error'};
        }
    }catch(err){
        console.error(err);
        return {result:'error'};
    }
    
}

module.exports = checkInfo;