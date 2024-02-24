const ERROR_MESSAGE = {
  INVALID_FIELD: "欄位未填寫正確或資料結構錯誤",
  INVALID_TITLE_FIELD_NOT_FOUND: "title欄位未填寫",
  INVALID_ID: "此ID未找到對應的代辦事項",
  INVALID_ROUTE: "無此網站路由",
};

function errorHandle(res, errMessage) {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: "false",
      message: errMessage,
    })
  );
  res.end();
}

module.exports = {
  errorHandle,
  ERROR_MESSAGE,
};
