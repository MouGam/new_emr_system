import {SERVER_IP} from "@env";

/* sendToServer 함수

- 역할
클라이언트에서 서버에 요청을 보내는 함수
모든 클라이언트에서 서버에 요청을 보내는 역할은 이 함수 내에서 처리한다.

- 인수
클라이언트에서 서버에 요청을 보내는데 필수적인 요소들은
1. 요청의 종류
2. 요청을 받아들이는데 서버가 필요로 하는 데이터
3. 요청을 보내는 사용자가 누구인지
세가지이다.

따라서 각 세 요소를 위해 인수로 request, data, identification을 받는다.
    - 인수의 타입과 활용
    1. request: string
    어떤 요청을 처리할지 받는다.
    url에 request를 추가해 요청을 보낸다.
    2. data: json
    요청에 필요한 데이터를 담는다.
    3. identification: json
    요청을 보내는 주체가 누구인지, 검증된 사용자인지 판단한다.
    서버에서 identification을 

    - data와 identification의 차이
    identification은 어느 사용자의 요청인지, 그 사용자가 적절한 사용자가 맞는지 판단한다.
    email, password 등을 포함한다.
    data는 request의 처리에 필요한 identification외의 정보들을 포함한다.

- 반환값
결과는 세가지중 하나다.
성공 -> 0 반환
실패 -> 1 반환
오류 -> 2 반환

서버로부터 json을 반환받고 json.result에 성공 실패 오류 여부를 보낸다.
json.message에 실패나 오류발생시 원인이 무엇인지 string으로 전송받는다.

오류시 message를 console.error로 출력하고 2를 반환한다.
성공이나 실패시 값을 그대로 반환한다.

- sendToServer 추가설명
request 종류
"signup"
"login"
"patient"


*/
async function sendToServer(request, identification, data){
    try{
        const submit = {
            identification:identification,
            data:data
        };

        //다른 문제 없으면 method는 모두 POST로 처리
        const res = await (await fetch(`http://${SERVER_IP}:3000/${request}`, {
            method:'POST',
            headers:{
                "Content-Type":'application/json'
            },
            body:JSON.stringify(submit),
        })).json();


        if(res.result === 2){
            console.error(res.message);
            return res;
        }
        
        return res;
    }catch(err){
        console.error(err);
        return {result:2, message:"UNDEFINEDERROR"}; //2는 에러
    }
}

module.exports = sendToServer;