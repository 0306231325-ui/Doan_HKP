<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->email)) {
            $this->merge(['email' => mb_strtolower(trim($this->email))]);
        }
    }

    public function rules(): array
    {
        return [
            'ho_ten' => ['required', 'string', 'max:150'],
            'ma_so' => ['required', 'string', 'max:50'],
            'so_dien_thoai' => ['required', 'string', 'max:20', 'regex:/^\+?[0-9 ]{9,20}$/'],
            'email' => ['required', 'string', 'email', 'max:191', 'unique:nguoi_dung,email'],
            'password' => ['required', 'string', 'min:8', 'max:72', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'Vui lòng nhập :attribute.',
            'string' => ':attribute phải là chuỗi ký tự.',
            'max' => ':attribute không được vượt quá :max ký tự.',
            'email.email' => 'Email không đúng định dạng.',
            'email.unique' => 'Email này đã được đăng ký.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
            'so_dien_thoai.regex' => 'Số điện thoại không hợp lệ.',
        ];
    }

    public function attributes(): array
    {
        return [
            'ho_ten' => 'họ và tên', 'ma_so' => 'mã sinh viên / giảng viên',
            'so_dien_thoai' => 'số điện thoại', 'email' => 'email', 'password' => 'mật khẩu',
        ];
    }
}
