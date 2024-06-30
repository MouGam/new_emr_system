# 아키네이터의 클라이언트

React Native

## 핵심 역할들
1. 서버와의 통신
2. 화면의 변경
3. 데이터 보여주기
4. 그외 내부적인 로직

위 4가지로 구분 가능

## 폴더구조와 폴더 설명
1. functions
    - 서버와 통신하는 함수
2. redux
   - 이용자 데이터를 redux를 이용해 저장하고 서버와 통신시 사용한다.
3. screen
  - 사용자에게 보이는 화면

## 서버와 통신시 json 구조(클라->서버)
{
    identification:json,
    data:json
}
    (참고, 서버->클라 : {result:int, message:string, data:json})