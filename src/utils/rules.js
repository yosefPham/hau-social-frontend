import _ from 'lodash';

const allCharacters =
    'a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹýếẾ';
// ten : trường tên
// text : trường text
// email
// soDienThoai
// ngaySinh
// required
// username
// password
// inputNumber
// CMND

const rules = {
    ten: [
        {
            max: 50,
            message: 'Không quá 50 kí tự',
        },
        {
            whitespace: true,
            message: 'Toàn kí tự trắng không hợp lệ',
        },
        {
            pattern: new RegExp(`^[${allCharacters} ]+$`),
            message: 'Tên chỉ bao gồm chữ cái',
        },
    ],
    text: [
        {
            whitespace: true,
            message: 'Toàn kí tự trắng không hợp lệ',
        },
    ],
    sotaikhoan: [
        {
            pattern: new RegExp('^[0-9-]+$'),
            message: 'Chỉ được nhập số',
        },
    ],
    email: [
        {
            validator: (__, email, callback) => {
                const re =
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!re.test(String(email).toLowerCase())) callback('');
                callback();
            },
            message: 'Email chưa đúng định dạng',
        },
    ],
    soDienThoai: [
        {
            pattern: new RegExp(/(^(09|03|07|08|05|01|02|04|06){1}[0-9]{8}$){1}/g),
            message: 'Số điện thoại không đúng định dạng(10 số, không bao gồm kí tự đặc biệt)',
        },
    ],
    required: [
        {
            required: true,
            message: 'Bắt buộc',
        },
    ],
    username: [
        {
            pattern: new RegExp('^[a-zA-Z0-9._]{4,32}$'),
            message: 'Độ dài 4 tới 32 kí tự, chỉ dùng chữ thường, chữ hoa, số, ".", "_"',
        },
        // {
        //   pattern: new RegExp('^(?![_.])[a-zA-Z0-9._]+(?<![_.])$'),
        //   message: 'Không bao gồm "_" hay "." ở đầu hoặc cuối'
        // }
    ],
    password: [
        {
            pattern: new RegExp('^[0-9a-zA-Z~!@#$%^&*(_)+/<>?}{:;",.=|]{8,}$'),
            message: 'Độ dài ít nhất 8 kí tự, không sử dụng ký tự khoảng trắng',
        },
        // {
        //   pattern: new RegExp(
        //     '^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z~!@#$%^&*(_)+/<>?}{:;",.=|]+$'
        //   ),
        //   message: 'Bao gồm cả chữ và số'
        // }
    ],
    CMND: [
        {
            pattern: new RegExp('^[0-9]{9}$|^[0-9]{12}$'),
            message: 'Bao gồm 9 hoặc 12 chữ số',
        },
    ],
    fileRequired: [
        {
            validator: (__, value, callback) => {
                if (_.get(value, 'fileList', []).length === 0) callback('');
                callback();
            },
            message: 'Hãy chọn file',
        },
        {
            required: true,
            message: 'Bắt buộc',
        },
    ],
};

export default rules;
