// 4.1 ส่วนที่ 1
// ส่วนที่ 1: การ import libraries และไฟล์ที่เกี่ยวข้อง
import 'package:flutter/material.dart';
import 'package:flutter/material.dart';
import 'src/home.dart';
import 'src/cart.dart';
import 'src/history.dart';
import 'src/account.dart';

// 4.2 ส่วนที่ 2 (คงเดิม)
// ส่วนที่ 2: Main function คือ จุดเริ่มต้นของแอพ

void main() {
  runApp(const MyApp());
}

// ส่วนที่ 3: MyApp คือ StatelessWidget ที่ไม่ต้องการเปลี่ยนแปลงค่าหรือสถานะในระหว่างที่แอพทำงาน
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Shopdee',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
      ),
      home: const MyHomePage(title: 'ช้อปดี'),
    );
  }
}

// 4.3 ส่วนที่ 3
// ส่วนที่ 3: MyApp คือ StatelessWidget ที่ไม่ต้องการเปลี่ยนแปลงค่าหรือสถานะในระหว่างที่แอพทำงาน
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: const Center(
        child: Text('Home Page'),
      ),
    );
  }
}

// ----------------- หน้า Cart -----------------
class CartPage extends StatelessWidget {
  const CartPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cart'),
      ),
      body: const Center(
        child: Text('Cart Page'),
      ),
    );
  }
}

// ----------------- หน้า History -----------------
class HistoryPage extends StatelessWidget {
  const HistoryPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('History'),
      ),
      body: const Center(
        child: Text('History Page'),
      ),
    );
  }
}

// ----------------- หน้า Account -----------------
class AccountPage extends StatelessWidget {
  const AccountPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Account'),
      ),
      body: const Center(
        child: Text('Account Page'),
      ),
    );
  }
}

// ----------------- Main -----------------



class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    const HomePage(),
    const CartPage(),
    const HistoryPage(),
    const AccountPage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'หน้าแรก',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart),
            label: 'ตะกร้า',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.history),
            label: 'ประวัติ',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_circle),
            label: 'บัญชี',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: const Color(0xFF2F80ED),
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
      ),
    );
  }
}