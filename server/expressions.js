const mail_expr = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const token_expr = /^\d+_[a-f0-9]+$/;
const int_expr = /^(\d){1,10}$/;
const uname_expr = /^[a-zA-Zа-яА-Я0-9]{3,}$/;
const nick_expr = /^[a-zA-Z_\-$0-9]{3,}$/;
const pass_expr = /^[a-zA-Z0-9_\-!()]{8,}$/;

module.exports = ({
  mail_expr,
  nick_expr,
  pass_expr,
  uname_expr,
  token_expr,
  int_expr
});