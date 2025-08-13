# Tailwind CSS 스타일 가이드

## 텍스트 (Text)

### 폰트 크기 (Font Size)
```css
text-xs      /* 12px */
text-sm      /* 14px */
text-base    /* 16px */
text-lg      /* 18px */
text-xl      /* 20px */
text-2xl     /* 24px */
text-3xl     /* 30px */
text-4xl     /* 36px */
text-5xl     /* 48px */
text-6xl     /* 60px */
text-7xl     /* 72px */
text-8xl     /* 96px */
text-9xl     /* 128px */

/* 임의 값 사용 */
text-[15px]  /* 15px */
text-[13px]  /* 13px */
```

### 폰트 굵기 (Font Weight)
```css
font-thin        /* 100 */
font-extralight  /* 200 */
font-light       /* 300 */
font-normal      /* 400 */
font-medium      /* 500 */
font-semibold    /* 600 */
font-bold        /* 700 */
font-extrabold   /* 800 */
font-black       /* 900 */
```

### 텍스트 색상 (Text Color)
```css
text-black
text-white
text-gray-50   /* 가장 밝은 회색 */
text-gray-100
text-gray-200
text-gray-300
text-gray-400
text-gray-500
text-gray-600
text-gray-700
text-gray-800
text-gray-900  /* 가장 어두운 회색 */

/* 커스텀 색상 (프로젝트에서 정의된 색상) */
text-primary
text-primaryLight
text-primaryDark
text-red
text-error
```

### 텍스트 정렬 (Text Alignment)
```css
text-left
text-center
text-right
text-justify
```

## 패딩 (Padding)

### 전체 패딩
```css
p-0     /* 0px */
p-1     /* 4px */
p-2     /* 8px */
p-3     /* 12px */
p-4     /* 16px */
p-5     /* 20px */
p-6     /* 24px */
p-8     /* 32px */
p-10    /* 40px */
p-12    /* 48px */
p-16    /* 64px */
p-20    /* 80px */
```

### 방향별 패딩
```css
/* 좌우 패딩 */
px-1, px-2, px-3, px-4, px-5, px-6, px-8, px-10, px-12

/* 상하 패딩 */
py-1, py-2, py-3, py-4, py-5, py-6, py-8, py-10, py-12

/* 개별 방향 */
pt-4  /* padding-top */
pb-4  /* padding-bottom */
pl-4  /* padding-left */
pr-4  /* padding-right */
```

## 마진 (Margin)

### 전체 마진
```css
m-0, m-1, m-2, m-3, m-4, m-5, m-6, m-8, m-10, m-12, m-16, m-20
```

### 방향별 마진
```css
/* 좌우 마진 */
mx-1, mx-2, mx-3, mx-4, mx-5, mx-6, mx-8, mx-10, mx-12

/* 상하 마진 */
my-1, my-2, my-3, my-4, my-5, my-6, my-8, my-10, my-12

/* 개별 방향 */
mt-4  /* margin-top */
mb-4  /* margin-bottom */
ml-4  /* margin-left */
mr-4  /* margin-right */
```

## 크기 (Width & Height)

### 너비 (Width)
```css
w-auto     /* auto */
w-full     /* 100% */
w-screen   /* 100vw */
w-1/2      /* 50% */
w-1/3      /* 33.333% */
w-2/3      /* 66.667% */
w-1/4      /* 25% */
w-3/4      /* 75% */

/* 고정 크기 */
w-4      /* 16px */
w-8      /* 32px */
w-12     /* 48px */
w-16     /* 64px */
w-20     /* 80px */
w-24     /* 96px */
w-32     /* 128px */
w-40     /* 160px */
w-48     /* 192px */
w-56     /* 224px */
w-64     /* 256px */

/* 임의 값 */
w-[300px]
w-[50%]
```

### 높이 (Height)
```css
h-auto     /* auto */
h-full     /* 100% */
h-screen   /* 100vh */
h-1/2      /* 50% */
h-1/3      /* 33.333% */
h-2/3      /* 66.667% */
h-1/4      /* 25% */
h-3/4      /* 75% */

/* 고정 크기 */
h-4, h-8, h-12, h-16, h-20, h-24, h-32, h-40, h-48, h-56, h-64

/* 임의 값 */
h-[300px]
h-[50vh]
```

## 배경 (Background)

### 배경 색상
```css
bg-white
bg-black
bg-transparent
bg-gray-50 ~ bg-gray-900

/* 커스텀 색상 */
bg-primary
bg-primaryLight
bg-primaryDark
bg-red
bg-error
```

### 배경 호버 효과
```css
hover:bg-gray-50
hover:bg-gray-100
hover:bg-primary
hover:bg-red-50
```

## 보더 (Border)

### 보더 두께
```css
border     /* 1px */
border-0   /* 0px */
border-2   /* 2px */
border-4   /* 4px */
border-8   /* 8px */
```

### 보더 색상
```css
border-gray-200
border-gray-300
border-gray-400
border-primary
border-red
```

### 보더 방향
```css
border-t   /* top */
border-b   /* bottom */
border-l   /* left */
border-r   /* right */
```

## 둥근 모서리 (Border Radius)

```css
rounded-none    /* 0px */
rounded-sm      /* 2px */
rounded         /* 4px */
rounded-md      /* 6px */
rounded-lg      /* 8px */
rounded-xl      /* 12px */
rounded-2xl     /* 16px */
rounded-3xl     /* 24px */
rounded-full    /* 9999px */

/* 방향별 */
rounded-t-lg    /* top */
rounded-b-lg    /* bottom */
rounded-l-lg    /* left */
rounded-r-lg    /* right */
```

## 플렉스 (Flexbox)

### 플렉스 컨테이너
```css
flex            /* display: flex */
flex-col        /* flex-direction: column */
flex-row        /* flex-direction: row */
```

### 정렬
```css
justify-start      /* justify-content: flex-start */
justify-center     /* justify-content: center */
justify-end        /* justify-content: flex-end */
justify-between    /* justify-content: space-between */
justify-around     /* justify-content: space-around */

items-start        /* align-items: flex-start */
items-center       /* align-items: center */
items-end          /* align-items: flex-end */
items-stretch      /* align-items: stretch */
```

### 간격
```css
gap-1, gap-2, gap-3, gap-4, gap-5, gap-6, gap-8, gap-10, gap-12
```

## 그림자 (Shadow)

```css
shadow-none
shadow-sm
shadow          /* 기본 그림자 */
shadow-md
shadow-lg       /* 많이 사용 */
shadow-xl
shadow-2xl
shadow-inner
```

## 포지션 (Position)

```css
static
relative
absolute
fixed
sticky
```

### 위치 조정
```css
top-0, top-1, top-2, top-4, top-8, top-12, top-16
bottom-0, bottom-1, bottom-2, bottom-4, bottom-8, bottom-12, bottom-16
left-0, left-1, left-2, left-4, left-8, left-12, left-16
right-0, right-1, right-2, right-4, right-8, right-12, right-16
```

## Z-Index

```css
z-0
z-10
z-20
z-30
z-40
z-50      /* 일반적인 드롭다운 */
z-60      /* 서브메뉴 */
z-auto
```

## 투명도 (Opacity)

```css
opacity-0      /* 0% */
opacity-25     /* 25% */
opacity-50     /* 50% */
opacity-75     /* 75% */
opacity-100    /* 100% */
```

## 커서 (Cursor)

```css
cursor-auto
cursor-default
cursor-pointer     /* 많이 사용 */
cursor-wait
cursor-text
cursor-move
cursor-not-allowed
```

## 호버 효과 (Hover)

```css
hover:bg-gray-50
hover:text-primary
hover:shadow-lg
hover:scale-105
hover:opacity-75
hover:border-primary
```

## 트랜지션 (Transition)

```css
transition-none
transition-all
transition          /* 기본 트랜지션 */
transition-colors   /* 색상 변화만 */
transition-opacity  /* 투명도 변화만 */
transition-transform /* 변형 변화만 */
```

### 트랜지션 지속 시간
```css
duration-75
duration-100
duration-150
duration-200
duration-300
duration-500
duration-700
duration-1000
```

## 임의 값 사용 (Arbitrary Values)

```css
/* 모든 속성에 임의 값 사용 가능 */
w-[350px]
h-[calc(100vh-64px)]
text-[#1a1a1a]
bg-[rgb(255,0,0)]
p-[10px]
m-[5px_10px]
```

## 반응형 (Responsive)

```css
/* 기본: 모바일 우선 */
text-sm           /* 모든 화면 */
md:text-base      /* 768px 이상 */
lg:text-lg        /* 1024px 이상 */
xl:text-xl        /* 1280px 이상 */
2xl:text-2xl      /* 1536px 이상 */

/* 반응형 브레이크포인트 */
sm:    /* 640px 이상 */
md:    /* 768px 이상 */
lg:    /* 1024px 이상 */
xl:    /* 1280px 이상 */
2xl:   /* 1536px 이상 */
```

## 프로젝트 커스텀 색상

```css
/* globals.css에 정의된 색상들 */
text-primary        /* #b7c774 */
text-primaryLight   /* #ddebb0 */
text-primaryDark    /* #8a9e4e */
text-gray           /* #6b7280 */
text-grayLight      /* #d1d5db */
text-hintText       /* #9ca3af */
text-error          /* #ef4444 */
text-red            /* #ff3b30 */

bg-primary
bg-primaryLight
bg-primaryDark
bg-gray
bg-grayLight
bg-hintText
bg-error
bg-red
```

## 자주 사용하는 조합 예시

### 버튼 스타일
```css
className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors cursor-pointer"
```

### 카드 스타일
```css
className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
```

### 드롭다운 메뉴
```css
className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
```

### 인풋 필드
```css
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
```

### 플렉스 센터 정렬
```css
className="flex items-center justify-center"
```