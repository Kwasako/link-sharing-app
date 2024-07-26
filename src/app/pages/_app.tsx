import { AppProps } from 'next/app';
import '../firebase'; // This ensures Firebase is initialized

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;