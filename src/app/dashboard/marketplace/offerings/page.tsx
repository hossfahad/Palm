import { Container } from '@mantine/core';
import { PageHeader } from '@/components/layout/page-header';
import { OfferingsContent } from '@/components/offerings/offerings-content';
import { HeaderActions } from '@/components/offerings/header-actions';

export default function OfferingsPage() {
  return (
    <>
      <PageHeader 
        title="DAF Programs" 
        action={<HeaderActions />}
      />
      <Container size="xl" py="xl">
        <OfferingsContent />
      </Container>
    </>
  );
} 