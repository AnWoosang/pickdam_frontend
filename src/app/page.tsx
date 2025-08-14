import { MainLayout } from '@/components/layout/MainLayout';
import { HomeScreen } from '@/features/home/components/homeScreen';

export default function Home() {
  return (
    <MainLayout showHeader={true} showFooter={true} disableContainer={true}>
      <HomeScreen />
    </MainLayout>
  );
}
