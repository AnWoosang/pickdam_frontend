import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ProductDetailPage } from '@/features/product-detail/components/productDetailPage';
import { getProductDetail } from '@/constants/products-mockdata';
import { MainLayout } from '@/components/layout/mainLayout';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 메타데이터 생성
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductDetail(id);
  
  if (!product) {
    return {
      title: '상품을 찾을 수 없습니다 - 픽담',
    };
  }

  return {
    title: `${product.name} - 픽담`,
    description: `${product.name} 상품의 최저가를 비교하고 리뷰를 확인하세요. ${product.flavor} 맛, ${product.capacity} 용량의 ${product.inhaleType} 전용 상품입니다.`,
    keywords: [
      product.name,
      product.flavor,
      product.capacity,
      product.inhaleType,
      '전자담배',
      '베이프',
      '가격비교',
      '픽담'
    ].join(', '),
    openGraph: {
      title: `${product.name} - 픽담`,
      description: `${product.name} 최저가 비교 및 리뷰`,
      images: [
        {
          url: product.thumbnailUrl,
          width: 300,
          height: 300,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - 픽담`,
      description: `${product.name} 최저가 비교 및 리뷰`,
      images: [product.thumbnailUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductDetail(id);

  if (!product) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="py-6">
        <ProductDetailPage product={product} />
      </div>
    </MainLayout>
  );
}

// 정적 경로 생성 (선택사항 - 빌드 시 미리 생성할 경로들)
export async function generateStaticParams() {
  // 실제 환경에서는 API에서 상품 ID 목록을 가져와야 함
  return [
    // 몇 개의 대표 상품들
    { id: 'liquid-001' },
    { id: 'liquid-002' },
    { id: 'device-001' },
    { id: 'device-002' },
    { id: 'accessory-001' },
    { id: 'accessory-008' },
  ];
}