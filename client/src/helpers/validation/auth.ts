import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Введіть коректний формат email')
    .required("Email обов'язковий"),
  password: yup.string().required("Пароль обов'язковий"),
  remember_me: yup.boolean().optional(),
});

export const registerSchema = yup.object({
  email: yup
    .string()
    .email('Введіть коректний формат email')
    .required("Email обов'язковий"),
  password: yup
    .string()
    .min(6, 'Пароль має містити мінімум 6 символів')
    .required("Пароль обов'язковий"),
  confirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Паролі не співпадають')
    .required('Підтвердіть пароль'),
});
