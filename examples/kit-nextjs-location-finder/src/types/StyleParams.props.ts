interface styleParams {
  params: {
    styles: string;
  };
}

const positionCenterParams: styleParams = {
  params: {
    styles: 'position-center',
  },
};
const positionLeftParams: styleParams = {
  params: {
    styles: 'position-left',
  },
};
const positionRightParams: styleParams = {
  params: {
    styles: 'position-right',
  },
};
const indentBothParams: styleParams = {
  params: {
    styles: 'indent-top indent-bottom',
  },
};
const indentTopParams: styleParams = {
  params: {
    styles: 'indent-top',
  },
};
const indentbottomParams: styleParams = {
  params: {
    styles: 'indent-bottom',
  },
};

export {
  type styleParams,
  positionCenterParams,
  positionLeftParams,
  positionRightParams,
  indentBothParams,
  indentTopParams,
  indentbottomParams,
};
