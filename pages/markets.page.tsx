import { Container } from '@mui/material';
import { ReactNode, useEffect } from 'react';
import { MainLayout } from 'src/layouts/MainLayout';
import { useRouter } from 'next/router';

interface MarketContainerProps {
  children: ReactNode;
}

export const marketContainerProps = {
  sx: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    pb: '39px',
    px: {
      xs: 2,
      xsm: 5,
      sm: 12,
      md: 5,
      lg: 0,
      xl: '96px',
      xxl: 0,
    },
    maxWidth: {
      xs: 'unset',
      lg: '1240px',
      xl: '1240px',
      xxl: '1240px',
    },
  },
};

export const MarketContainer = ({ children }: MarketContainerProps) => {
  return <Container {...marketContainerProps}>{children}</Container>;
};

export default function Markets() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, []);

  return <></>;
}

Markets.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
