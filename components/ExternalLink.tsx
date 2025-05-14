import { Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type LinkProps = ComponentProps<typeof Link>;
type Props = Omit<LinkProps, 'href'> & { href: LinkProps['href'] };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          event.preventDefault();
          let url = href;
          if (typeof href === 'object' && href !== null) {
            url = href.pathname;
            if (href.params) {
              const params = new URLSearchParams(href.params as Record<string, string>).toString();
              url += params ? `?${params}` : '';
            }
          }
          await openBrowserAsync(url as string);
        }
      }}
    />
  );
}
