import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RegisterPage extends StatefulWidget {
  const RegisterPage({Key? key}) : super(key: key);

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  String _username = '';
  String _password = '';
  String _firstName = '';
  String _lastName = '';
  bool _isLoading = false;

  Future<void> _submit() async {
    if (_formKey.currentState?.validate() ?? false) {
      _formKey.currentState?.save();
      setState(() {
        _isLoading = true;
      });

      final response = await http.post(
        Uri.parse('http://localhost:4000/api/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': _username,
          'password': _password,
          'firstName': _firstName,
          'lastName': _lastName,
        }),
      );

      setState(() {
        _isLoading = false;
      });

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['status'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data['message'] ?? 'Registered successfully!')),
        );
        Navigator.pop(context); // กลับไปหน้า login
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data['message'] ?? 'Registration failed')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Register')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                decoration: const InputDecoration(labelText: 'Username'),
                validator: (value) =>
                    value != null && value.isNotEmpty ? null : 'Enter a username',
                onSaved: (value) => _username = value ?? '',
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Password'),
                obscureText: true,
                validator: (value) =>
                    value != null && value.length >= 4 ? null : 'Password must be at least 4 characters',
                onSaved: (value) => _password = value ?? '',
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'First Name'),
                validator: (value) =>
                    value != null && value.isNotEmpty ? null : 'Enter first name',
                onSaved: (value) => _firstName = value ?? '',
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Last Name'),
                validator: (value) =>
                    value != null && value.isNotEmpty ? null : 'Enter last name',
                onSaved: (value) => _lastName = value ?? '',
              ),
              const SizedBox(height: 24),
              _isLoading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                      onPressed: _submit,
                      child: const Text('Register'),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}