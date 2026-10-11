def calculate(a, operator, b):
    if operator == "+":
        return a + b
    elif operator == "-":
        return a - b
    elif operator == "*":
        return a * b
    elif operator == "/":
        if b == 0:
            return "خطا: تقسیم بر صفر!"
        return a / b
    else:
        return "عملگر نامعتبر است!"


print("ماشین حساب ساده")

while True:
    try:
        a = input("عدد اول (برای خروج q): ")
        if a.lower() == "q":
            break

        a = float(a)
        operator = input("عملگر (+ - * /): ")
        b = float(input("عدد دوم: "))

        print("نتیجه:", calculate(a, operator, b))

    except ValueError:
        print("لطفاً عدد معتبر وارد کن.")
