from machine import Pin, PWM
import ds18x20
import onewire
import time
import ssd1306
from machine import SoftI2C


# 参数设置（可调整）
TEMP_TARGET    = 37.0   # A仓目标温度（工程菌）
TEMP_LOW       = 36.5   # 低于此温度开始加热
TEMP_HIGH      = 37.5   # 高于此温度停止加热
TEMP_ALARM_BC  = 30.0   # B/C仓报警温度

# 三个级别的喷菌时间（秒）
BACTERIA_TIME = {1: 20, 2: 30, 3: 45}

# 三个级别的药物比例（泵B%，泵C%，持续秒数）
MEDICINE_DOSE = {
    1: (30, 30, 15),   # I级：轻度坏死
    2: (60, 60, 20),   # II级：中度坏死
    3: (100, 100, 30), # III级：重度坏死
}


# 初始化引脚
# 温度传感器
ow = onewire.OneWire(Pin(4))
ds = ds18x20.DS18X20(ow)

# 水泵
pump_a = PWM(Pin(14), freq=1000)  # 工程菌泵
pump_b = PWM(Pin(27), freq=1000)  # 药物1泵
pump_c = PWM(Pin(26), freq=1000)  # 药物2泵

# 加热片和雾化片
heater   = Pin(12, Pin.OUT)
atomizer = Pin(13, Pin.OUT)

# 按键
btn1 = Pin(32, Pin.IN, Pin.PULL_UP)  # I级
btn2 = Pin(33, Pin.IN, Pin.PULL_UP)  # II级
btn3 = Pin(34, Pin.IN, Pin.PULL_UP)  # III级

# OLED屏幕
i2c  = SoftI2C(scl=Pin(22), sda=Pin(21))
oled = ssd1306.SSD1306_I2C(128, 64, i2c)


# 工具函数
# 读取三个仓的温度
def get_temperatures():
    roms = ds.scan()
    ds.convert_temp()
    time.sleep_ms(750)
    temps = []
    for rom in roms:
        temps.append(ds.read_temp(rom))
    # 不足3个传感器时补0
    while len(temps) < 3:
        temps.append(0.0)
    return temps   # [A仓温度, B仓温度, C仓温度]

# 设置泵速（百分比0~100）
def set_pumps(a_pct, b_pct, c_pct):
    pump_a.duty(int(a_pct * 10.23))
    pump_b.duty(int(b_pct * 10.23))
    pump_c.duty(int(c_pct * 10.23))

# 关闭所有泵和雾化片
def stop_all():
    set_pumps(0, 0, 0)
    atomizer.value(0)

# OLED显示两行文字
def show_oled(line1, line2="", line3="", line4=""):
    oled.fill(0)
    oled.text(line1, 0, 0)
    oled.text(line2, 0, 16)
    oled.text(line3, 0, 32)
    oled.text(line4, 0, 48)
    oled.show()


# A仓温度控制（持续调用）
def control_heater(temp_a):
    if temp_a < TEMP_LOW:
        heater.value(1)    # 开始加热
    elif temp_a > TEMP_HIGH:
        heater.value(0)    # 停止加热
    # 36.5~37.5之间保持当前状态不变

# B/C仓温度报警检测
def check_alarm(temp_b, temp_c):
    alarm_b = temp_b > TEMP_ALARM_BC
    alarm_c = temp_c > TEMP_ALARM_BC
    return alarm_b, alarm_c


# 喷雾主流程
def run_nebulize(level):
    bact_time  = BACTERIA_TIME[level]
    b_pct, c_pct, med_time = MEDICINE_DOSE[level]

    atomizer.value(1)   # 开启雾化片

    # ── 第一阶段：喷工程菌 ──
    show_oled(
        "Phase 1: Bacteria",
        "Level " + str(level),
        str(bact_time) + " seconds...",
        "Do not remove"
    )
    set_pumps(80, 0, 0)   # 只开泵A

    for i in range(bact_time):
        # 喷菌过程中继续维持A仓温度
        temps = get_temperatures()
        control_heater(temps[0])
        show_oled(
            "Phase 1: Bacteria",
            "Remaining:",
            str(bact_time - i) + " sec",
            "T:" + str(round(temps[0], 1)) + "C"
        )
        time.sleep(1)

    # ── 第二阶段：按比例喷药物 ──
    show_oled(
        "Phase 2: Medicine",
        "Level " + str(level),
        "B:" + str(b_pct) + "% C:" + str(c_pct) + "%",
        str(med_time) + " seconds..."
    )
    set_pumps(20, b_pct, c_pct)   # 泵A保持低速，泵B/C按比例

    for i in range(med_time):
        temps = get_temperatures()
        control_heater(temps[0])
        show_oled(
            "Phase 2: Medicine",
            "Remaining:",
            str(med_time - i) + " sec",
            "T:" + str(round(temps[0], 1)) + "C"
        )
        time.sleep(1)

    # ── 结束 ──
    stop_all()
    show_oled("Done!", "Remove mouthpiece", "", "")
    time.sleep(3)


# 主循环
def main():
    current_level = 0
    show_oled("SCLC Nebulizer", "Select Level:", "1=Mild 2=Med", "3=Severe")

    while True:

        # 读取温度
        temps = get_temperatures()
        temp_a = temps[0]
        temp_b = temps[1]
        temp_c = temps[2]

        # A仓持续控温
        control_heater(temp_a)

        # B/C仓报警检测
        alarm_b, alarm_c = check_alarm(temp_b, temp_c)

        # 报警显示（优先级最高）
        if alarm_b or alarm_c:
            msg = ""
            if alarm_b:
                msg += "B-WARN! "
            if alarm_c:
                msg += "C-WARN!"
            show_oled(
                "!! TEMP ALARM !!",
                msg,
                "Open lid or",
                "replace medicine"
            )
            time.sleep(2)
            continue   # 跳过按键检测，先处理报警

        # 按键检测
        if btn1.value() == 0:
            current_level = 1
            time.sleep_ms(200)
            show_oled("Level I selected", "Mild necrosis", "Press again", "to start")
            time.sleep(1)
            # 等待再次按下启动
            while btn1.value() == 1:
                temps = get_temperatures()
                control_heater(temps[0])
                time.sleep_ms(100)
            run_nebulize(1)

        elif btn2.value() == 0:
            current_level = 2
            time.sleep_ms(200)
            show_oled("Level II selected", "Moderate necrosis", "Press again", "to start")
            time.sleep(1)
            while btn2.value() == 1:
                temps = get_temperatures()
                control_heater(temps[0])
                time.sleep_ms(100)
            run_nebulize(2)

        elif btn3.value() == 0:
            current_level = 3
            time.sleep_ms(200)
            show_oled("Level III selected", "Severe necrosis", "Press again", "to start")
            time.sleep(1)
            while btn3.value() == 1:
                temps = get_temperatures()
                control_heater(temps[0])
                time.sleep_ms(100)
            run_nebulize(3)

        # 待机界面
        else:
            show_oled(
                "SCLC Nebulizer",
                "T:" + str(round(temp_a, 1)) + "C",
                "1=Mild 2=Med",
                "3=Severe"
            )

        time.sleep_ms(100)

# 启动
main()