import { Observable, from, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';


  /**
   * Return an observable that will emit random text to be displayed as an
   * "animation" at regular intervals, ending with the specified text.
   * @param {string} newText
   * @returns {Observable<string>}
   */
export function animateToText(newText: string): Observable<string> {
    const randomStrings: string[] = [];

    for (let i = 0; i < 5; i++) {
      randomStrings.push(getRandomString(newText));
    }
    randomStrings.push(newText);

    return from(randomStrings)
      .pipe(
        concatMap((t) => of(t)
          .pipe(delay(25))
        )
      );
  }

function getRandomString(realText: string): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\u0a00';
    const length = realText.length;
    let str = '';

    for (let i = 0; i < length ; i++) {
      const ch = realText[i];
      if (isWhitespace(ch)) {
        str += ch;
      }
      else {
        str += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }

    return str;
  }

function isWhitespace(ch: string): boolean {
  return ' \t\n\r\v'.indexOf(ch) > -1;
}


