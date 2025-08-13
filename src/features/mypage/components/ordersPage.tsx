'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Order } from '@/types/user';

interface OrdersPageProps {
  className?: string;
}

// Mock 주문 내역 데이터
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'PD2024010001',
    status: 'delivered',
    items: [
      {
        id: '1',
        productId: 'prod1',
        productName: 'JUUL Pod Classic Virginia',
        productImage: '/images/products/juul-pod.jpg',
        brand: 'JUUL',
        quantity: 2,
        unitPrice: 25000,
        totalPrice: 50000,
      },
    ],
    totalAmount: 53000,
    paymentMethod: '카드결제',
    shippingAddress: {
      id: '1',
      name: '홍길동',
      phoneNumber: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      detailAddress: '456호',
      zipCode: '12345',
      isDefault: true,
    },
    orderedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    trackingNumber: '1234567890',
  },
  {
    id: '2',
    orderNumber: 'PD2024010002',
    status: 'shipped',
    items: [
      {
        id: '2',
        productId: 'prod2',
        productName: 'IQOS ILUMA Prime Kit',
        productImage: '/images/products/iqos-iluma.jpg',
        brand: 'IQOS',
        quantity: 1,
        unitPrice: 120000,
        totalPrice: 120000,
      },
    ],
    totalAmount: 123000,
    paymentMethod: '카드결제',
    shippingAddress: {
      id: '1',
      name: '홍길동',
      phoneNumber: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      detailAddress: '456호',
      zipCode: '12345',
      isDefault: true,
    },
    orderedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    trackingNumber: '9876543210',
  },
  {
    id: '3',
    orderNumber: 'PD2024010003',
    status: 'pending',
    items: [
      {
        id: '3',
        productId: 'prod3',
        productName: 'Vaporesso XROS 3 Pod Kit',
        productImage: '/images/products/vaporesso-xros.jpg',
        brand: 'Vaporesso',
        quantity: 1,
        unitPrice: 45000,
        totalPrice: 45000,
      },
    ],
    totalAmount: 48000,
    paymentMethod: '무통장입금',
    shippingAddress: {
      id: '1',
      name: '홍길동',
      phoneNumber: '010-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      detailAddress: '456호',
      zipCode: '12345',
      isDefault: true,
    },
    orderedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const statusInfo = {
  pending: { label: '결제대기', color: 'text-yellow-600 bg-yellow-50', icon: Clock },
  confirmed: { label: '주문확인', color: 'text-blue-600 bg-blue-50', icon: CheckCircle },
  shipped: { label: '배송중', color: 'text-purple-600 bg-purple-50', icon: Truck },
  delivered: { label: '배송완료', color: 'text-green-600 bg-green-50', icon: Package },
  cancelled: { label: '주문취소', color: 'text-red-600 bg-red-50', icon: XCircle },
};

export function OrdersPage({ className = '' }: OrdersPageProps) {
  const router = useRouter();
  const [orders] = useState<Order[]>(mockOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleBack = () => {
    router.push('/mypage');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const OrderCard = React.memo(({ order }: { order: Order }) => {
    const StatusIcon = statusInfo[order.status].icon;
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* 주문 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">주문번호: {order.orderNumber}</h3>
            <p className="text-sm text-gray-600">{formatDate(order.orderedAt)}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo[order.status].color}`}>
              <StatusIcon className="w-4 h-4 mr-1" />
              {statusInfo[order.status].label}
            </div>
            
            <Link
              href={`/mypage/orders/${order.id}`}
              className="p-2 text-gray-400 transition-colors"
              title="주문 상세보기"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 주문 상품 목록 */}
        <div className="space-y-3 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs">이미지</div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/product/${item.productId}`}
                  className="block transition-colors"
                >
                  <p className="font-medium text-gray-900 line-clamp-1">{item.productName}</p>
                  <p className="text-sm text-gray-600">{item.brand}</p>
                </Link>
              </div>
              
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {formatPrice(item.unitPrice)}원 × {item.quantity}
                </p>
                <p className="text-sm text-gray-600">
                  {formatPrice(item.totalPrice)}원
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 주문 요약 정보 */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">
              <span className="mr-4">결제방법: {order.paymentMethod}</span>
              {order.trackingNumber && (
                <span>운송장번호: {order.trackingNumber}</span>
              )}
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                총 {formatPrice(order.totalAmount)}원
              </p>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              배송지: {order.shippingAddress.address} {order.shippingAddress.detailAddress}
            </div>
            
            <div className="flex items-center space-x-2">
              {order.status === 'delivered' && (
                <button className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md transition-colors">
                  리뷰 작성
                </button>
              )}
              
              {order.status === 'pending' && (
                <button className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md transition-colors">
                  주문 취소
                </button>
              )}
              
              {order.trackingNumber && order.status === 'shipped' && (
                <button className="px-3 py-2 text-sm text-primary border border-primary rounded-md transition-colors">
                  배송 조회
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });

  OrderCard.displayName = 'OrderCard';

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>뒤로가기</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">주문 내역</h1>
            <p className="text-gray-600 mt-1">총 {orders.length}개의 주문</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-primary" />
          <span className="font-medium">{orders.length}</span>
        </div>
      </div>

      {orders.length === 0 ? (
        /* 빈 상태 */
        <div className="text-center py-16">
          <div className="mb-4">
            <Package className="w-16 h-16 mx-auto text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">주문 내역이 없습니다</h3>
          <p className="text-gray-600 mb-6">첫 주문을 시작해보세요!</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary transition-colors"
          >
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <>
          {/* 상태 필터 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedStatus === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체 ({orders.length})
              </button>
              
              {Object.entries(statusInfo).map(([status, info]) => {
                const count = orders.filter(order => order.status === status).length;
                if (count === 0) return null;
                
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedStatus === status
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {info.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* 주문 목록 */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">해당 상태의 주문이 없습니다.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}