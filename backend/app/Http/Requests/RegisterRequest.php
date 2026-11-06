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
            $this->merge(['email' => mb_strtolower($this->email)]);
        }
    }

    public function rules(): array
    {
        return [
            'ho_ten' => ['bail', 'required', 'string', 'max:100', 'regex:/\A[\p{L}\p{M} ]*\p{L}[\p{L}\p{M} ]*\z/u'],
            'ma_so' => ['bail', 'required', 'string', 'min:6', 'max:20', 'regex:/\A[A-Za-z0-9]+\z/', 'unique:nguoi_dung,ma_so'],
            'so_dien_thoai' => ['bail', 'required', 'string', 'max:10', 'regex:/\A0[0-9]{0,9}\z/'],
            'email' => ['bail', 'required', 'string', 'max:191', 'email', 'regex:/\A[a-z0-9]+@(?:[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?\.)+edu\.vn\z/', 'unique:nguoi_dung,email'],
            'password' => ['required', 'string', 'min:8', 'max:72', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Vui lòng nhập email.',
            'email.regex' => 'Email phải có đuôi .edu.vn; phần tên chỉ gồm chữ cái không dấu và số, không chứa khoảng trắng hoặc ký tự đặc biệt.',
            'ma_so.required' => 'Vui lòng nhập MSSV / Mã giảng viên.',
            'ma_so.min' => 'MSSV / Mã giảng viên phải có ít nhất 6 ký tự.',
            'ma_so.max' => 'MSSV / Mã giảng viên không được vượt quá 20 ký tự.',
            'ma_so.regex' => 'MSSV / Mã giảng viên chỉ được chứa chữ cái không dấu và số, không chứa khoảng trắng hoặc ký tự đặc biệt.',
            'ma_so.unique' => 'MSSV / Mã giảng viên này đã được đăng ký.',
            'ho_ten.required' => 'Vui lòng nhập họ và tên, không được chỉ chứa khoảng trắng.',
            'ho_ten.max' => 'Họ và tên không được vượt quá 100 ký tự.',
            'ho_ten.regex' => 'Họ và tên chỉ được chứa chữ cái và khoảng trắng.',
            'required' => 'Vui lòng nhập :attribute.',
            'string' => ':attribute phải là chuỗi ký tự.',
            'max' => ':attribute không được vượt quá :max ký tự.',
            'email.email' => 'Email không đúng định dạng.',
            'email.unique' => 'Email này đã được đăng ký.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
            'so_dien_thoai.required' => 'Vui lòng nhập số điện thoại.',
            'so_dien_thoai.max' => 'Số điện thoại không được vượt quá 10 chữ số.',
            'so_dien_thoai.regex' => 'Số điện thoại phải bắt đầu bằng số 0 và chỉ chứa chữ số, tối đa 10 số.',
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
