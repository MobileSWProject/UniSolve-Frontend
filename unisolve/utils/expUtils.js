// expUtils.js
export function getExpToLevel(t, index) {
  return t(`User.exp_${index}`);
}

export function getPercent(exp) {
  const percent =
    exp < 101
      ? (exp / 101) * 100
      : exp < 301
      ? ((exp - 101) / (301 - 101)) * 100
      : exp < 501
      ? ((exp - 301) / (501 - 301)) * 100
      : exp < 701
      ? ((exp - 501) / (701 - 501)) * 100
      : exp < 1001
      ? ((exp - 701) / (1001 - 701)) * 100
      : exp < 1501
      ? ((exp - 1001) / (1501 - 1001)) * 100
      : exp < 2001
      ? ((exp - 1501) / (2001 - 1501)) * 100
      : exp < 3001
      ? ((exp - 2001) / (3001 - 2001)) * 100
      : exp < 5001
      ? ((exp - 3001) / (5001 - 3001)) * 100
      : 100;
  return percent.toFixed(2);
}

export function getLevel(exp) {
  return (
    exp < 101 ?
    1 :
    exp < 301 ?
    2 :
    exp < 501 ?
    3 :
    exp < 701 ?
    4 :
    exp < 1001 ?
    5 :
    exp < 1501 ?
    6 :
    exp < 2001 ?
    7 :
    exp < 3001 ?
    8 :
    exp < 5001 ?
    9 :
    10
  )-1;
}
