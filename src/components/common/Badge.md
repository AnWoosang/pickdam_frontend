# Badge 컴포넌트

재사용 가능한 뱃지 컴포넌트입니다.

## 기본 사용법

```tsx
import { Badge } from '@/components/common/Badge';

// 기본 뱃지
<Badge>기본 뱃지</Badge>

// 다양한 variant
<Badge variant="primary">주요</Badge>
<Badge variant="secondary">보조</Badge>
<Badge variant="success">성공</Badge>
<Badge variant="warning">경고</Badge>
<Badge variant="error">오류</Badge>

// 커스텀 색상
<Badge variant="custom" color="#FF5722">커스텀 색상</Badge>

// 다양한 크기
<Badge size="small">작은 크기</Badge>
<Badge size="medium">중간 크기</Badge>
<Badge size="large">큰 크기</Badge>

// 클릭 가능한 뱃지
<Badge onClick={() => console.log('클릭됨!')}>클릭 가능</Badge>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | 뱃지 내용 |
| variant | BadgeVariant | 'default' | 뱃지 스타일 변형 |
| size | BadgeSize | 'medium' | 뱃지 크기 |
| color | string | - | 커스텀 배경 색상 (variant="custom"일 때) |
| className | string | '' | 추가 CSS 클래스 |
| onClick | () => void | - | 클릭 핸들러 |

## Types

```tsx
export type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'custom';

export type BadgeSize = 'small' | 'medium' | 'large';
```