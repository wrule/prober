import Hasha from 'hasha';

export function Hash(text: string): string {
  return Hasha(text, {
    algorithm: 'sha1',
  });
}
