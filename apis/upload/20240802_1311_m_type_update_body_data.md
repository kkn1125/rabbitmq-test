# 위험요소 업데이트 시 바디 데이터

기본 바디 데이터 포맷

배열 형태로 items라는 이름에 담아 보내면 됩니다.

배열의 요소는 다음과 같은 형식입니다.

{
  id: number,
  m_type: number,
  condition: 'on' | 'off', 
  acc_id: 'drop'|'collapse' ...
}

## 2023년 위험요소

```javascript
// 2023년 m_type 1 (가설비계)
// m_type이 1일 때 위험요소 id 1 ~ 10까지 사용됩니다.
{
  items: [
    {
      id: 1,
      m_type: 1,
      condition: "on",
      acc_id: "drop",
    },
    {
      id: 2,
      m_type: 1,
      condition: "off",
      acc_id: "collapse",
    },
    {
      id: 3,
      m_type: 1,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 4,
      m_type: 1,
      condition: "on",
      acc_id: "drop",
    },
    {
      id: 5,
      m_type: 1,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 6,
      m_type: 1,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 7,
      m_type: 1,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 8,
      m_type: 1,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 9,
      m_type: 1,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 10,
      m_type: 1,
      condition: "on",
      acc_id: "drop",
    },
  ];
}
```

```javascript
// 2023년 m_type 2 (타워크레인)
// m_type이 2일 때 위험요소 id 11 ~ 15까지 사용됩니다.
{
  items: [
    {
      id: 11,
      m_type: 2,
      condition: "on",
      acc_id: "fallnbump",
    },
    {
      id: 12,
      m_type: 2,
      condition: "off",
      acc_id: "fall",
    },
    {
      id: 13,
      m_type: 2,
      condition: "on",
      acc_id: "fall",
    },
    {
      id: 14,
      m_type: 2,
      condition: "on",
      acc_id: "fallnbump",
    },
    {
      id: 15,
      m_type: 2,
      condition: "on",
      acc_id: "fallnbump",
    },
  ];
}
```

```javascript
// 2023년 m_type 3 (거푸집, 동바리)
// m_type이 3일 때 위험요소 id 16 ~ 20까지 사용됩니다.
{
  items: [
    {
      id: 16,
      m_type: 3,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 17,
      m_type: 3,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 18,
      m_type: 3,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 19,
      m_type: 3,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 20,
      m_type: 3,
      condition: "on",
      acc_id: "collapse",
    },
  ];
}
```

```javascript
// 2023년 m_type 4 (데크플레이트)
// m_type이 4일 때 위험요소 id 21 ~ 25까지 사용됩니다.
{
  items: [
    {
      id: 21,
      m_type: 4,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 22,
      m_type: 4,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 23,
      m_type: 4,
      condition: "on",
      acc_id: "drop",
    },
    {
      id: 24,
      m_type: 4,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 25,
      m_type: 4,
      condition: "on",
      acc_id: "fall",
    },
  ];
}
```

```javascript
// 2023년 m_type 5 (철골공사)
// m_type이 5일 때 위험요소 id 26 ~ 30까지 사용됩니다.
{
  items: [
    {
      id: 26,
      m_type: 5,
      condition: "on",
      acc_id: "fallnbump",
    },
    {
      id: 27,
      m_type: 5,
      condition: "on",
      acc_id: "drop",
    },
    {
      id: 28,
      m_type: 5,
      condition: "on",
      acc_id: "drop",
    },
    {
      id: 29,
      m_type: 5,
      condition: "on",
      acc_id: "drop",
    },
    {
      id: 30,
      m_type: 5,
      condition: "on",
      acc_id: "collapse",
    },
  ];
}
```

```javascript
// 2022년 m_type 11, 12, 13 (가시설 - 타설중 동바리 설치 불량, 비상대피로, 타설 계획 미이행)
// m_type이 11, 12, 13일 때 위험요소 id는 각각 31, 32, 33까지 사용됩니다.
{
  items: [
    {
      id: 31,
      m_type: 11,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 32,
      m_type: 12,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 33,
      m_type: 13,
      condition: "on",
      acc_id: "collapse",
    },
  ];
}
```

```javascript
// 2022년 m_type 14, 15, 16 (건설기계 - 안전관리 수립 미이동, 아웃 트리거 미설치, 인양물)
// m_type이 14, 15, 16일 때 위험요소 id는 각각 34, 35, 36까지 사용됩니다.
{
  items: [
    {
      id: 34,
      m_type: 14,
      condition: "on",
      acc_id: "fall",
    },
    {
      id: 35,
      m_type: 15,
      condition: "on",
      acc_id: "fall",
    },
    {
      id: 36,
      m_type: 16,
      condition: "on",
      acc_id: "fall",
    },
  ];
}
```

```javascript
// 2022년 m_type 17, 18 (토공사 배면 - 굴착 시공 흙막이지보공 미설치, 안전성 검토 결과 도면 작업 미이행)
// m_type이 17, 18일 때 위험요소 id는 각각 37, 38까지 사용됩니다.
{
  items: [
    {
      id: 37,
      string_name: "굴착 시공 시 흙막이지보공 미설치로 인한 사고",
      m_type: 17,
      condition: "on",
      acc_id: "collapse",
    },
    {
      id: 38,
      string_name: "안전성 검토 결과 통과 도면 작업 미이행으로 인한 사고",
      m_type: 18,
      condition: "on",
      acc_id: "collapse",
    },
  ];
}
```
